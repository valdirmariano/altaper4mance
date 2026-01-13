// Definição de temas para o sistema Alta Per4mance ⬏
// Cores de destaque personalizáveis pelo usuário

export interface ThemeColors {
  id: string;
  name: string;
  nameEn: string;
  class: string;
  preview: string; // Cor em HEX para preview
  category: 'neutral' | 'warm' | 'cool' | 'vibrant';
}

export const accentThemes: ThemeColors[] = [
  // Neutros
  {
    id: 'white',
    name: 'Minimalista',
    nameEn: 'Minimalist',
    class: 'accent-white',
    preview: '#FFFFFF',
    category: 'neutral',
  },
  
  // Cool tones
  {
    id: 'cyan',
    name: 'Ciano',
    nameEn: 'Cyan',
    class: 'accent-cyan',
    preview: '#00D9FF',
    category: 'cool',
  },
  {
    id: 'blue',
    name: 'Azul Safira',
    nameEn: 'Sapphire Blue',
    class: 'accent-blue',
    preview: '#3B82F6',
    category: 'cool',
  },
  {
    id: 'electric',
    name: 'Azul Elétrico',
    nameEn: 'Electric Blue',
    class: 'accent-electric',
    preview: '#00BFFF',
    category: 'cool',
  },
  {
    id: 'purple',
    name: 'Roxo Violeta',
    nameEn: 'Violet Purple',
    class: 'accent-purple',
    preview: '#9945FF',
    category: 'cool',
  },
  {
    id: 'lavender',
    name: 'Lavanda',
    nameEn: 'Lavender',
    class: 'accent-lavender',
    preview: '#B794F6',
    category: 'cool',
  },
  
  // Greens
  {
    id: 'green',
    name: 'Verde Esmeralda',
    nameEn: 'Emerald Green',
    class: 'accent-green',
    preview: '#00D084',
    category: 'cool',
  },
  {
    id: 'mint',
    name: 'Verde Menta',
    nameEn: 'Mint',
    class: 'accent-mint',
    preview: '#00C9A7',
    category: 'cool',
  },
  {
    id: 'lime',
    name: 'Verde Limão',
    nameEn: 'Lime',
    class: 'accent-lime',
    preview: '#84CC16',
    category: 'vibrant',
  },
  {
    id: 'neon',
    name: 'Verde Neon',
    nameEn: 'Neon Green',
    class: 'accent-neon',
    preview: '#00FF00',
    category: 'vibrant',
  },
  
  // Warm tones
  {
    id: 'yellow',
    name: 'Amarelo Ouro',
    nameEn: 'Gold Yellow',
    class: 'accent-yellow',
    preview: '#FFD60A',
    category: 'warm',
  },
  {
    id: 'orange',
    name: 'Laranja Âmbar',
    nameEn: 'Amber Orange',
    class: 'accent-orange',
    preview: '#F97316',
    category: 'warm',
  },
  {
    id: 'coral',
    name: 'Coral',
    nameEn: 'Coral',
    class: 'accent-coral',
    preview: '#FF6B6B',
    category: 'warm',
  },
  {
    id: 'rosegold',
    name: 'Rosa Dourado',
    nameEn: 'Rose Gold',
    class: 'accent-rosegold',
    preview: '#D4A574',
    category: 'warm',
  },
  
  // Vibrant/Pink tones
  {
    id: 'pink',
    name: 'Rosa Magenta',
    nameEn: 'Magenta Pink',
    class: 'accent-pink',
    preview: '#FF006E',
    category: 'vibrant',
  },
  {
    id: 'ruby',
    name: 'Rubi',
    nameEn: 'Ruby',
    class: 'accent-ruby',
    preview: '#E11D48',
    category: 'vibrant',
  },
];

export const getThemeById = (id: string): ThemeColors | undefined => {
  return accentThemes.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: ThemeColors['category']): ThemeColors[] => {
  return accentThemes.filter(theme => theme.category === category);
};

export const defaultAccentTheme = 'white';
