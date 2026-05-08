"use client";

import { MouseParallax } from "./mouse-parallax";
import { Code2, Palette, Zap, Sparkles } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Developpement",
    description: "React, Next.js, TypeScript et les technologies web modernes",
  },
  {
    icon: Palette,
    title: "Design",
    description: "UI/UX, branding et creation d'identites visuelles uniques",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimisation, animations fluides et experiences rapides",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Exploration de nouvelles technologies et approches creatives",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      {/* Background */}
      <MouseParallax intensity={15} className="absolute inset-0 overflow-hidden">
        <div
          data-parallax="0.4"
          className="absolute top-1/4 right-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        />
      </MouseParallax>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - About Text */}
          <div>
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-wider uppercase rounded-full glass text-primary">
              A propos
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Creer des experiences <span className="text-gradient">memorables</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Passione par le design et le developpement web, je cree des
                experiences digitales qui allient esthetique et fonctionnalite.
              </p>
              <p>
                Chaque projet est une opportunite d&apos;explorer de nouvelles
                possibilites et de repousser les limites du possible sur le web.
              </p>
              <p>
                Mon approche combine une attention meticuleuse aux details avec
                une vision creative pour delivrer des resultats exceptionnels.
              </p>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill.title}
                className="p-6 rounded-2xl glass hover-glow transition-all group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <skill.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {skill.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
