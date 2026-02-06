import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Search,
  Plus,
  FolderOpen,
  MoreHorizontal,
  Archive,
  Inbox,
  Layers,
  BookOpen,
  Trash2,
  Edit,
  Loader2,
  FileText,
  Tag,
  Clock
} from 'lucide-react';
import { useNotes, NoteCategory, Note, CreateNoteInput } from '@/hooks/useNotes';

const SecondBrain = () => {
  const { notes, loading, createNote, updateNote, deleteNote, getCategoryCount } = useNotes();
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<CreateNoteInput>({
    title: '',
    content: '',
    category: 'inbox',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { id: 'inbox' as NoteCategory, label: 'Caixa de Entrada', icon: Inbox, color: 'text-blue-400' },
    { id: 'projects' as NoteCategory, label: 'Projetos', icon: FolderOpen, color: 'text-green-400' },
    { id: 'areas' as NoteCategory, label: 'Áreas', icon: Layers, color: 'text-purple-400' },
    { id: 'resources' as NoteCategory, label: 'Recursos', icon: BookOpen, color: 'text-amber-400' },
    { id: 'archive' as NoteCategory, label: 'Arquivo', icon: Archive, color: 'text-muted-foreground' },
  ];

  const filteredNotes = notes.filter(note => {
    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    
    await createNote({
      ...formData,
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean)
    });
    
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!editingNote || !formData.title.trim()) return;
    
    await updateNote(editingNote.id, {
      ...formData,
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean)
    });
    
    setIsEditOpen(false);
    setEditingNote(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
      category: note.category,
      tags: note.tags
    });
    setTagInput(note.tags.join(', '));
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'inbox', tags: [] });
    setTagInput('');
  };

  const getCategoryInfo = (catId: string) => categories.find(c => c.id === catId);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Segundo Cérebro</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sistema P.A.R.A. para gestão de conhecimento
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const count = getCategoryCount(cat.id);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card 
                className={`p-3 bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer transition-all duration-300 hover:bg-card/80 ${
                  selectedCategory === cat.id ? 'ring-1 ring-foreground/20 bg-card/80' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${cat.color}`} />
                  <span className="text-xs text-muted-foreground truncate">{cat.label}</span>
                  <span className="text-sm font-bold ml-auto">{count}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar notas por título ou conteúdo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-11 pr-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
        />
      </motion.div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note, i) => {
            const catInfo = getCategoryInfo(note.category);
            const CatIcon = catInfo?.icon || FileText;
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                layout
              >
                <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-border transition-all duration-300 group h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CatIcon className={`h-4 w-4 ${catInfo?.color || 'text-muted-foreground'}`} />
                      <span className="text-xs text-muted-foreground">{catInfo?.label || note.category}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(note)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-2">{note.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {note.content || 'Sem conteúdo'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1 flex-wrap">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-muted/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{note.tags.length - 2}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(note.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* New Note Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className="p-5 border-dashed border-border/50 hover:border-foreground/20 hover:bg-card/30 transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[180px]"
            onClick={() => setIsCreateOpen(true)}
          >
            <div className="text-center text-muted-foreground">
              <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Nova Nota</p>
              <p className="text-xs mt-1 opacity-70">Clique para adicionar</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {filteredNotes.length === 0 && notes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhuma nota encontrada</p>
          <p className="text-sm mt-1 opacity-70">Tente outro termo de busca</p>
        </motion.div>
      )}

      {notes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-muted-foreground"
        >
          <Brain className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="font-medium text-lg">Seu segundo cérebro está vazio</p>
          <p className="text-sm mt-1 opacity-70">Comece organizando seu conhecimento com o método P.A.R.A.</p>
          <Button className="mt-6 rounded-xl" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar primeira nota
          </Button>
        </motion.div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Título da nota"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Conteúdo..."
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
            <Select
              value={formData.category}
              onValueChange={(value: NoteCategory) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Tags (separadas por vírgula)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!formData.title.trim()}>
              Criar Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Título da nota"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Conteúdo..."
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
            <Select
              value={formData.category}
              onValueChange={(value: NoteCategory) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Tags (separadas por vírgula)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setEditingNote(null); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={!formData.title.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecondBrain;
