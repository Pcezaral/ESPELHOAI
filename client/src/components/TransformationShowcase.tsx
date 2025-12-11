import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface TransformationItem {
  id: string;
  style: string;
  description: string;
  before: string;
  after: string;
  emoji: string;
}

const transformations: TransformationItem[] = [
  {
    id: 'epic',
    style: 'Épico',
    description: 'Heróis e lendas',
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    emoji: '⚔️'
  },
  {
    id: 'gangster',
    style: 'Gangster',
    description: 'Estilo mafioso clássico',
    before: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    emoji: '🎩'
  },
  {
    id: 'painting',
    style: 'Pintura',
    description: 'Obras de arte clássicas',
    before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop',
    emoji: '🎨'
  },
  {
    id: 'circus',
    style: 'Circo',
    description: 'Palhaço e diversão',
    before: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    emoji: '🤡'
  },
  {
    id: 'animal',
    style: 'Bichinho',
    description: 'Animais fofos e divertidos',
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    emoji: '🐱'
  },
  {
    id: 'monster',
    style: 'Monstro',
    description: 'Criaturas assustadoras',
    before: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    emoji: '👹'
  }
];

export default function TransformationShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Veja a Magia Acontecer
            </h2>
            <Sparkles className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha um estilo e transforme suas fotos em algo completamente novo. 
            Passe o mouse para ver a transformação!
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {transformations.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Card Container */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-200">
                  {/* Before Image */}
                  <img
                    src={item.before}
                    alt={`${item.style} - Antes`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      hoveredId === item.id ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  
                  {/* After Image */}
                  <img
                    src={item.after}
                    alt={`${item.style} - Depois`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Overlay com Label */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">✨</div>
                      <p className="font-bold text-lg">Transformado!</p>
                    </div>
                  </div>

                  {/* Label Antes/Depois */}
                  <div className={`absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900 transition-opacity duration-300 ${
                    hoveredId === item.id ? 'opacity-0' : 'opacity-100'
                  }`}>
                    Antes
                  </div>
                  <div className={`absolute top-3 left-3 bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold text-white transition-opacity duration-300 ${
                    hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    Depois
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{item.emoji}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {item.style}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-block bg-orange-50 border-2 border-orange-200 rounded-lg p-6 md:p-8">
            <p className="text-gray-700 mb-4">
              Esses são apenas alguns exemplos! Existem muito mais estilos esperando por você.
            </p>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">
              🎁 Você tem <span className="text-orange-500">5 créditos grátis</span> para começar!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
