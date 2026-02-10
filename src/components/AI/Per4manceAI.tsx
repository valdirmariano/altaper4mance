import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Image, Volume2, VolumeX, Bot, User, Sparkles, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  { id: 'pt-BR-female', label: 'Feminina (BR)', icon: '👩' },
  { id: 'pt-BR-male', label: 'Masculina (BR)', icon: '👨' },
];

export default function Per4manceAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou o **Per4mance AI**, seu assistente pessoal de produtividade com **visão inteligente**.\n\n📸 **Envie qualquer imagem** e eu analiso para você:\n• 📋 Lista de tarefas escritas à mão → crio tarefas automaticamente\n• 💰 Notas fiscais e recibos → registro despesas\n• 🥗 Planos de dieta → organizo suas refeições\n• 💪 Fichas de treino → acompanho seu progresso\n• 📚 Anotações de estudo → transcrevo e resumo\n\n🎯 **Também posso:**\n• Criar tarefas, projetos, metas e hábitos\n• Analisar sua produtividade e finanças\n• Sugerir melhorias personalizadas\n\nEnvie uma foto ou me diga como posso ajudar! 🚀',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('pt-BR-female');
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
      const jsonMatch = content.match(/\{[\s\S]*?"action"[\s\S]*?"data"[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.action && parsed.data) return parsed as ActionData;
      }
    } catch { /* Not a JSON action */ }
    return null;
  }, []);

  const executeAction = useCallback(async (actionData: ActionData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error('Faça login para executar ações'); return; }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/per4mance-action`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify(actionData) }
      );
      if (response.ok) {
        const actionLabels: Record<string, string> = { create_task: 'Tarefa criada', create_project: 'Projeto criado', create_habit: 'Hábito criado', create_goal: 'Meta criada', create_transaction: 'Transação registrada' };
        toast.success(actionLabels[actionData.action] || 'Ação executada com sucesso! ✨');
      } else { toast.error('Erro ao executar ação'); }
    } catch { toast.error('Erro ao executar ação'); }
  }, []);

  const speakText = useCallback(async (text: string) => {
    if (!audioEnabled) return;
    try {
      setIsSpeaking(true);
      const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '').replace(/\[.*?\]\(.*?\)/g, '').replace(/`/g, '').replace(/\n/g, '. ').substring(0, 1000);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
        if (ptVoice) utterance.voice = ptVoice;
        if (selectedVoice.includes('female')) {
          const fv = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt_BR')) && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('feminino')));
          if (fv) utterance.voice = fv;
        } else {
          const mv = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt_BR')) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('masculino')));
          if (mv) utterance.voice = mv;
        }
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else { toast.info('Seu navegador não suporta síntese de voz.'); setIsSpeaking(false); }
    } catch { setIsSpeaking(false); }
  }, [audioEnabled, selectedVoice]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsSpeaking(false);
  }, []);

  const streamChat = useCallback(async (userMessage: string, imageBase64?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const messagesToSend = messages.filter(m => m.id !== '1').map(m => ({ role: m.role, content: m.content }));
    messagesToSend.push({ role: 'user', content: userMessage });
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/per4mance-chat`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: session ? `Bearer ${session.access_token}` : '' }, body: JSON.stringify({ messages: messagesToSend, imageBase64 }) }
    );
    if (!response.ok) { const error = await response.json(); throw new Error(error.error || 'Erro ao processar mensagem'); }
    if (!response.body) throw new Error('No response body');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantContent = '';
    let textBuffer = '';
    const assistantMessageId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }]);
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
          if (content) { assistantContent += content; setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: assistantContent } : m)); }
        } catch { textBuffer = line + '\n' + textBuffer; break; }
      }
    }
    setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, isStreaming: false } : m));
    const actionData = parseActionsFromResponse(assistantContent);
    if (actionData) await executeAction(actionData);
    if (audioEnabled && assistantContent) await speakText(assistantContent);
    return assistantContent;
  }, [messages, audioEnabled, parseActionsFromResponse, executeAction, speakText]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input.trim() || 'Analise esta imagem', imageUrl: selectedImage || undefined, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    const imageToSend = selectedImage;
    setSelectedImage(null);
    try { await streamChat(userMessage.content, imageToSend || undefined); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Erro ao enviar mensagem'); }
    finally { setIsLoading(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Por favor, selecione uma imagem'); return; }
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => { toast.info('Gravação concluída. Transcrição em desenvolvimento.'); stream.getTracks().forEach(track => track.stop()); };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      toast.info('Gravando... Clique novamente para parar.');
    } catch { toast.error('Erro ao acessar microfone'); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); mediaRecorderRef.current = null; } setIsRecording(false); };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-accent" />
          </motion.div>
          <div>
            <h2 className="font-bold text-foreground tracking-tight">Per4mance AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs text-muted-foreground">Online • Visão Universal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-card/50 border-border/50 backdrop-blur-sm">
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

          <Button variant="ghost" size="icon" onClick={() => setAudioEnabled(!audioEnabled)} className={`h-8 w-8 rounded-xl ${audioEnabled ? 'text-accent bg-accent/10' : 'text-muted-foreground'}`}>
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          {isSpeaking && (
            <Button variant="ghost" size="icon" onClick={stopSpeaking} className="h-8 w-8 rounded-xl text-destructive">
              <VolumeX className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-3.5 ${
                  message.role === 'user'
                    ? 'bg-accent text-accent-foreground rounded-br-md'
                    : 'bg-card/60 backdrop-blur-sm border border-border/50 rounded-bl-md'
                }`}>
                  {message.imageUrl && (
                    <img src={message.imageUrl} alt="Uploaded" className="max-w-full h-auto rounded-xl mb-2 max-h-48 object-cover" />
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {renderMessageContent(message.content)}
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-accent/60 animate-pulse ml-0.5 rounded-full" />
                    )}
                  </div>
                  <p className="text-[10px] mt-2 opacity-40">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-secondary/50 border border-border/50 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              </div>
              <div className="rounded-2xl rounded-bl-md p-3.5 bg-card/60 backdrop-blur-sm border border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Pensando</span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 border-t border-border/50 bg-card/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={selectedImage} alt="Preview" className="h-16 rounded-xl object-cover border border-border/50" />
                <Button variant="destructive" size="icon" className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full" onClick={() => setSelectedImage(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-xs">
                <Image className="w-3 h-3 mr-1" />
                OCR ativo
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="flex gap-2 items-end max-w-3xl mx-auto">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="shrink-0 h-10 w-10 rounded-xl hover:bg-accent/10 hover:text-accent">
              <Image className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={isRecording ? stopRecording : startRecording} disabled={isLoading}
              className={`shrink-0 h-10 w-10 rounded-xl ${isRecording ? 'text-destructive bg-destructive/10 animate-pulse' : 'hover:bg-accent/10 hover:text-accent'}`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </motion.div>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem ou envie uma foto..."
            className="min-h-[44px] max-h-32 resize-none rounded-xl bg-card/50 border-border/50 backdrop-blur-sm focus:border-accent/50 transition-colors"
            disabled={isLoading}
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleSend} disabled={(!input.trim() && !selectedImage) || isLoading}
              className="shrink-0 h-10 w-10 rounded-xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
              size="icon"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>

        <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
          📸 Envie fotos de notas fiscais, listas manuscritas ou treinos para processamento automático
        </p>
      </div>
    </motion.div>
  );
}
