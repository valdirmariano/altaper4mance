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
  Loader2
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
    { id: 'inbox' as NoteCategory, label: 'Caixa de Entrada', icon: Inbox },
    { id: 'projects' as NoteCategory, label: 'Projetos', icon: FolderOpen },
    { id: 'areas' as NoteCategory, label: 'Áreas', icon: Layers },
    { id: 'resources' as NoteCategory, label: 'Recursos', icon: BookOpen },
    { id: 'archive' as NoteCategory, label: 'Arquivo', icon: Archive },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Segundo Cérebro</h1>
          <p className="text-muted-foreground text-sm">
            Sistema P.A.R.A. para gestão de conhecimento
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Categories */}
          <Card className="p-3 bg-card border-border">
            <div className="space-y-1">
              <Button
                variant={selectedCategory === null ? 'secondary' : 'ghost'}
                className="w-full justify-start h-9 px-3"
                onClick={() => setSelectedCategory(null)}
              >
                <Brain className="h-4 w-4 mr-3" />
                Todas as Notas
                <span className="ml-auto text-xs text-muted-foreground">{notes.length}</span>
              </Button>
              {categories.map((category) => {
                const Icon = category.icon;
                const count = getCategoryCount(category.id);
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start h-9 px-3"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {category.label}
                    <span className="ml-auto text-xs text-muted-foreground">{count}</span>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Notes Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="p-4 bg-card border-border hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{note.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
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
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {note.content || 'Sem conteúdo'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{note.tags.length - 2}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </Card>
            ))}

            {/* New Note Card */}
            <Card 
              className="p-4 border-dashed border-border hover:border-muted-foreground/30 transition-colors cursor-pointer flex items-center justify-center min-h-32"
              onClick={() => setIsCreateOpen(true)}
            >
              <div className="text-center text-muted-foreground">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Nova Nota</p>
              </div>
            </Card>
          </div>

          {filteredNotes.length === 0 && notes.length > 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma nota encontrada</p>
            </div>
          )}

          {notes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="mb-1">Seu segundo cérebro está vazio</p>
              <p className="text-sm">Comece adicionando sua primeira nota!</p>
            </div>
          )}
        </div>
      </div>

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
