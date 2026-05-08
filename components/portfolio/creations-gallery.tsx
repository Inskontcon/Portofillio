"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Creation {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
}

interface CreationsGalleryProps {
  creations: Creation[];
}

export function CreationsGallery({ creations }: CreationsGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goToPrevious = useCallback(() => {
    if (isAnimating || creations.length === 0) return;
    setIsAnimating(true);
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? creations.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, creations.length]);

  const goToNext = useCallback(() => {
    if (isAnimating || creations.length === 0) return;
    setIsAnimating(true);
    setDirection("right");
    setCurrentIndex((prev) => (prev === creations.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, creations.length]);

  if (creations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 glass rounded-xl">
        <p className="text-muted-foreground">Aucune creation pour le moment</p>
      </div>
    );
  }

  const currentCreation = creations[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main Gallery Container */}
      <div className="relative overflow-hidden rounded-2xl glass">
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <div
            key={currentIndex}
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              isAnimating
                ? direction === "right"
                  ? "slide-in-right"
                  : "slide-in-left"
                : ""
            }`}
          >
            <Image
              src={currentCreation.image}
              alt={currentCreation.title}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end justify-between gap-6">
            <div className="flex-1">
              {currentCreation.category && (
                <span className="inline-block px-3 py-1 mb-3 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/20 text-primary">
                  {currentCreation.category}
                </span>
              )}
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                {currentCreation.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                {currentCreation.description}
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={isAnimating}
                className="h-12 w-12 rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover-glow"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={isAnimating}
                className="h-12 w-12 rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover-glow"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {creations.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setDirection(index > currentIndex ? "right" : "left");
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-6 right-6 px-4 py-2 rounded-full glass">
        <span className="text-sm font-mono text-foreground">
          {String(currentIndex + 1).padStart(2, "0")} / {String(creations.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
