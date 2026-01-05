import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Image, Volume2, VolumeX, Bot, User, Sparkles, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ActionData {
  action: string;
  data: Record<string, unknown>;
}

const VOICES = [
  { id: 'female-natural', label: 'Feminina Natural', icon: '👩' },
  { id: 'male-natural', label: 'Masculina Natural', icon: '👨' },
  { id: 'female-warm', label: 'Feminina Calorosa', icon: '👩‍🦰' },
  { id: 'male-calm', label: 'Masculina Calma', icon: '🧔' },
];

export default function Per4manceAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou o **Per4mance AI**, seu assistente pessoal de produtividade. Posso ajudar você a:\n\n🎯 **Criar tarefas, projetos e metas** automaticamente\n💰 **Registrar despesas** a partir de fotos de notas fiscais\n📊 **Analisar sua produtividade** e sugerir melhorias\n🏃 **Acompanhar seus hábitos** e manter seu streak\n\nComo posso ajudar você hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('female-natural');
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseActionsFromResponse = useCallback((content: string): ActionData | null => {
    try {
      // Look for JSON action in the response
      const jsonMatch = content.match(/\{[\s\S]*?"action"[\s\S]*?"data"[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.action && parsed.data) {
          return parsed as ActionData;
        }
      }
    } catch {
      // Not a JSON action, that's fine
    }
    return null;
  }, []);

  const executeAction = useCallback(async (actionData: ActionData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Faça login para executar ações');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/per4mance-action`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(actionData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const actionLabels: Record<string, string> = {
          create_task: 'Tarefa criada',
          create_project: 'Projeto criado',
          create_habit: 'Hábito criado',
          create_goal: 'Meta criada',
          create_transaction: 'Transação registrada',
        };
        toast.success(actionLabels[actionData.action] || 'Ação executada com sucesso! ✨');
        console.log('Action result:', result);
      } else {
        toast.error('Erro ao executar ação');
      }
    } catch (error) {
      console.error('Action error:', error);
      toast.error('Erro ao executar ação');
    }
  }, []);

  const speakText = useCallback(async (text: string) => {
    if (!audioEnabled) return;

    try {
      setIsSpeaking(true);
      
      // Remove markdown and special characters for TTS
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/`/g, '')
        .substring(0, 500); // Limit text length

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/per4mance-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ text: cleanText, voice: selectedVoice }),
        }
      );

      if (response.ok) {
        const { audioContent } = await response.json();
        const audioUrl = `data:audio/mpeg;base64,${audioContent}`;
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => setIsSpeaking(false);
        await audioRef.current.play();
      } else {
        const error = await response.json();
        if (error.error === 'TTS não configurado') {
          toast.info('Síntese de voz não configurada. Configure a chave ElevenLabs nas configurações.');
          setAudioEnabled(false);
        }
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, [audioEnabled, selectedVoice]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const streamChat = useCallback(async (userMessage: string, imageBase64?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    const messagesToSend = messages
      .filter(m => m.id !== '1') // Exclude welcome message
      .map(m => ({ role: m.role, content: m.content }));
    
    messagesToSend.push({ role: 'user', content: userMessage });

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/per4mance-chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session ? `Bearer ${session.access_token}` : '',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          imageBase64,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao processar mensagem');
    }

    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantContent = '';
    let textBuffer = '';

    const assistantMessageId = crypto.randomUUID();
    
    setMessages(prev => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantMessageId
                  ? { ...m, content: assistantContent }
                  : m
              )
            );
          }
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    // Mark streaming as complete
    setMessages(prev =>
      prev.map(m =>
        m.id === assistantMessageId
          ? { ...m, isStreaming: false }
          : m
      )
    );

    // Check for actions in the response
    const actionData = parseActionsFromResponse(assistantContent);
    if (actionData) {
      await executeAction(actionData);
    }

    // Speak the response if audio is enabled
    if (audioEnabled && assistantContent) {
      await speakText(assistantContent);
    }

    return assistantContent;
  }, [messages, audioEnabled, parseActionsFromResponse, executeAction, speakText]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim() || 'Analise esta imagem',
      imageUrl: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    const imageToSend = selectedImage;
    setSelectedImage(null);

    try {
      await streamChat(userMessage.content, imageToSend || undefined);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // For now, just show a message - full STT would require additional setup
        toast.info('Gravação concluída. Transcrição em desenvolvimento.');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      toast.info('Gravando... Clique novamente para parar.');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Erro ao acessar microfone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n')
      .map((line, i) => {
        // Bold
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return (
          <span key={i} className="block" dangerouslySetInnerHTML={{ __html: processed }} />
        );
      });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Per4mance AI</h2>
            <p className="text-xs text-muted-foreground">Seu assistente de produtividade</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Voz" />
            </SelectTrigger>
            <SelectContent>
              {VOICES.map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  <span className="flex items-center gap-2">
                    <span>{voice.icon}</span>
                    <span>{voice.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={audioEnabled ? 'text-accent' : 'text-muted-foreground'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>

          {isSpeaking && (
            <Button
              variant="ghost"
              size="icon"
              onClick={stopSpeaking}
              className="text-destructive"
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
              )}

              <Card
                className={`max-w-[80%] p-3 ${
                  message.role === 'user'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card border-border'
                }`}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="Uploaded"
                    className="max-w-full h-auto rounded-lg mb-2 max-h-48 object-cover"
                  />
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {renderMessageContent(message.content)}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-accent/50 animate-pulse ml-1" />
                  )}
                </div>
                <p className="text-[10px] mt-2 opacity-60">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </Card>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              </div>
              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Pensando</span>
                  <span className="animate-pulse">...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Image Preview */}
      {selectedImage && (
        <div className="p-2 border-t border-border bg-card">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Preview"
              className="h-20 rounded-lg object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <Badge variant="secondary" className="ml-2">
            <Image className="w-3 h-3 mr-1" />
            Imagem anexada (OCR ativo)
          </Badge>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2 items-end max-w-3xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="shrink-0"
          >
            <Image className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`shrink-0 ${isRecording ? 'text-destructive animate-pulse' : ''}`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[44px] max-h-32 resize-none"
            disabled={isLoading}
          />

          <Button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="shrink-0 bg-accent hover:bg-accent/90"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          💡 Dica: Envie fotos de notas fiscais para registro automático de despesas
        </p>
      </div>
    </div>
  );
}
