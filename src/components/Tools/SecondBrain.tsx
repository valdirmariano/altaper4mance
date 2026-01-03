import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain,
  Search,
  Plus,
  FolderOpen,
  FileText,
  Tag,
  MoreHorizontal,
  Archive,
  Inbox,
  Layers,
  BookOpen
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'projects' | 'areas' | 'resources' | 'archive' | 'inbox';
  tags: string[];
  updatedAt: string;
}

const SecondBrain = () => {
  const [notes] = useState<Note[]>([
    { id: '1', title: 'Ideias para o curso', content: 'Módulo 1: Fundamentos...', category: 'projects', tags: ['curso', 'conteúdo'], updatedAt: '2026-01-03' },
    { id: '2', title: 'Rotina matinal ideal', content: 'Acordar às 6h, meditação...', category: 'areas', tags: ['rotina', 'produtividade'], updatedAt: '2026-01-02' },
    { id: '3', title: 'Resumo: Atomic Habits', content: 'Hábitos são compostos por...', category: 'resources', tags: ['livro', 'hábitos'], updatedAt: '2026-01-01' },
    { id: '4', title: 'Artigo sobre OKRs', content: 'OKRs são uma metodologia...', category: 'resources', tags: ['gestão', 'metas'], updatedAt: '2025-12-28' },
    { id: '5', title: 'Ideia de app', content: 'Um app que...', category: 'inbox', tags: [], updatedAt: '2026-01-03' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'inbox', label: 'Caixa de Entrada', icon: Inbox, count: notes.filter(n => n.category === 'inbox').length },
    { id: 'projects', label: 'Projetos', icon: FolderOpen, count: notes.filter(n => n.category === 'projects').length },
    { id: 'areas', label: 'Áreas', icon: Layers, count: notes.filter(n => n.category === 'areas').length },
    { id: 'resources', label: 'Recursos', icon: BookOpen, count: notes.filter(n => n.category === 'resources').length },
    { id: 'archive', label: 'Arquivo', icon: Archive, count: notes.filter(n => n.category === 'archive').length },
  ];

  const filteredNotes = notes.filter(note => {
    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <Button size="sm">
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
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start h-9 px-3"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {category.label}
                    <span className="ml-auto text-xs text-muted-foreground">{category.count}</span>
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
              <Card key={note.id} className="p-4 bg-card border-border hover:border-muted-foreground/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{note.title}</h3>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </Card>
            ))}

            {/* New Note Card */}
            <Card className="p-4 border-dashed border-border hover:border-muted-foreground/30 transition-colors cursor-pointer flex items-center justify-center min-h-32">
              <div className="text-center text-muted-foreground">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Nova Nota</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondBrain;
