"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="accueil" 
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-10"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Decorative circles - top left */}
      <div 
        className="absolute top-32 left-20 flex items-center gap-4"
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          transition: 'transform 0.4s ease-out'
        }}
      >
        <div className="w-3 h-3 bg-foreground rounded-full" />
        <div className="w-8 h-8 border border-foreground/50 rounded-full" />
      </div>

      {/* Decorative arcs - top right */}
      <div 
        className="absolute top-10 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
          transition: 'transform 0.4s ease-out'
        }}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <circle cx="250" cy="250" r="220" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20" />
          <circle cx="250" cy="250" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/15" />
          <circle cx="250" cy="250" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/10" />
        </svg>
      </div>

      {/* Header info */}
      <div className="absolute top-28 left-6 md:left-10">
        <p className="font-mono text-xs tracking-widest text-muted-foreground">PORTFOLIO — VOL. 01</p>
        <p className="font-mono text-xs tracking-widest text-muted-foreground mt-1">MODELISATEUR & BUILDER ROBLOX</p>
      </div>

      <div className="absolute top-28 right-6 md:right-10 text-right">
        <p className="font-mono text-xs tracking-widest text-muted-foreground">DISPONIBLE POUR COMMANDE</p>
        <p className="font-mono text-xs tracking-widest text-muted-foreground mt-1">PRIVE SEULEMENT — 2026</p>
      </div>

      {/* Main typography */}
      <div className="relative z-10 mt-20">
        <h1 
          className="font-display text-[11vw] md:text-[13vw] font-bold leading-none-custom tracking-tighter-custom"
          style={{
            transform: `translate(${mousePosition.x * -12}px, ${mousePosition.y * -12}px)`,
            transition: 'transform 0.4s ease-out'
          }}
        >
          inskon
        </h1>
        
        <h2 
          className="font-display text-[9vw] md:text-[11vw] font-bold tracking-tighter-custom text-outline mt-2 ml-[8%]"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
            transition: 'transform 0.4s ease-out',
            lineHeight: '0.9'
          }}
        >
          Portfolio.
        </h2>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 mt-16 flex items-center gap-8">
        <Link 
          href="/creations"
          className="group flex items-center gap-3 px-6 py-4 bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
        >
          <span>Voir mes creations</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
          Une pratique independante a la couture du design et du developpement Roblox.
        </p>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-10 right-10 w-20 h-20"
        style={{
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: 'transform 0.4s ease-out'
        }}
      >
        <div className="relative w-full h-full animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              id="textPath"
              d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
            <text className="text-[8px] fill-muted-foreground font-mono uppercase tracking-widest">
              <textPath href="#textPath">
                EXPLORER — DEFILER — PORTFOLIO — 
              </textPath>
            </text>
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border border-muted-foreground/50 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
