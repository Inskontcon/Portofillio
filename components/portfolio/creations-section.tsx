"use client";

import { CreationsGallery, Creation } from "./creations-gallery";
import { MouseParallax } from "./mouse-parallax";

// Sample creations data - you can replace these with your own
const sampleCreations: Creation[] = [
  {
    id: "1",
    title: "Project Aurora",
    description: "Une application web immersive utilisant des animations 3D et des effets visuels avances pour creer une experience utilisateur unique.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop",
    category: "Web Design",
  },
  {
    id: "2",
    title: "Nebula Dashboard",
    description: "Interface de tableau de bord moderne avec visualisation de donnees en temps reel et theme sombre elegant.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=1000&fit=crop",
    category: "UI/UX",
  },
  {
    id: "3",
    title: "Stellar Brand",
    description: "Identite visuelle complete pour une startup tech, incluant logo, charte graphique et supports marketing.",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1600&h=1000&fit=crop",
    category: "Branding",
  },
  {
    id: "4",
    title: "Cosmos App",
    description: "Application mobile cross-platform avec animations fluides et design minimaliste pour une experience optimale.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&h=1000&fit=crop",
    category: "Mobile",
  },
  {
    id: "5",
    title: "Void Interface",
    description: "Concept d'interface futuriste explorant les limites du design digital avec des interactions innovantes.",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&h=1000&fit=crop",
    category: "Concept",
  },
];

interface CreationsSectionProps {
  creations?: Creation[];
}

export function CreationsSection({ creations = sampleCreations }: CreationsSectionProps) {
  return (
    <section id="creations" className="relative py-24 md:py-32">
      {/* Background */}
      <MouseParallax intensity={15} className="absolute inset-0 overflow-hidden">
        <div
          data-parallax="0.3"
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        />
        <div
          data-parallax="0.6"
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />
      </MouseParallax>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-wider uppercase rounded-full glass text-primary">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            Mes <span className="text-gradient">Creations</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Decouvrez une selection de mes projets recents. Chaque creation
            represente une exploration unique du design et de la technologie.
          </p>
        </div>

        {/* Gallery */}
        <CreationsGallery creations={creations} />
      </div>
    </section>
  );
}
