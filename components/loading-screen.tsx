"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Simuler le chargement progressif
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Acceleration progressive
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      // Attendre un peu puis commencer l'animation de sortie
      const timeout = setTimeout(() => {
        setIsExiting(true)
        // Cacher completement apres l'animation
        setTimeout(() => setIsLoading(false), 800)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [progress])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center transition-all duration-700 ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Logo / Titre */}
      <div className={`mb-12 transition-all duration-500 ${isExiting ? "translate-y-[-20px] opacity-0" : ""}`}>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter-custom">
          <span className="text-muted-foreground">●</span> Pseudo
        </h1>
      </div>

      {/* Barre de progression */}
      <div className={`w-64 md:w-80 transition-all duration-500 ${isExiting ? "translate-y-[20px] opacity-0" : ""}`}>
        <div className="relative h-[2px] bg-border overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-foreground transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-4">
          <span className="font-mono text-xs text-muted-foreground">CHARGEMENT</span>
          <span className="font-mono text-xs text-foreground">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Animation de cercles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-border/20 animate-ping-slow ${isExiting ? "scale-150 opacity-0" : ""}`} style={{ animationDuration: "3s" }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full border border-border/30 animate-ping-slow ${isExiting ? "scale-150 opacity-0" : ""}`} style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
        </div>
      </div>
    </div>
  )
}
