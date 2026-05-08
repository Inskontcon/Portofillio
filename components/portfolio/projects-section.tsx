"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowRight, ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Project {
  id: string
  title: string
  description: string
  role: string
  tags: string[]
  images: string[]
  discord_link: string
  created_at: string
}

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "French Studios",
    description: "French Studio est un roleplay Francais qui melange WL et FA avec une WL qui est a Creteil et une FA a Lille. Je suis ravi de developper et de co-fonder le projet.",
    role: "Co-Fondateur",
    tags: ["ROBLOX", "MADE IN FRANCE", "WL-FA", "LILLE - CRETEIL"],
    images: [],
    discord_link: "https://discord.gg/uvCdpk5W24",
    created_at: "2026"
  },
  {
    id: "2",
    title: "French Products",
    description: "Informations a venir...",
    role: "Projet",
    tags: ["ROBLOX", "MADE IN FRANCE"],
    images: [],
    discord_link: "https://discord.gg/uvCdpk5W24",
    created_at: "2026"
  }
]

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const supabase = createClient()

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading projects:', error)
        setProjects(defaultProjects)
      } else if (data && data.length > 0) {
        setProjects(data)
      } else {
        setProjects(defaultProjects)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects(defaultProjects)
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const nextProject = () => {
    if (projects.length === 0) return
    setIsImageLoading(true)
    setCurrentIndex((prev) => (prev + 1) % projects.length)
    setTimeout(() => setIsImageLoading(false), 300)
  }

  const prevProject = () => {
    if (projects.length === 0) return
    setIsImageLoading(true)
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
    setTimeout(() => setIsImageLoading(false), 300)
  }

  // Afficher le loading state
  if (isLoading) {
    return (
      <section id="projects" className="relative min-h-screen flex items-center justify-center bg-card">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground font-mono text-sm">Chargement des projets...</span>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="relative min-h-screen flex items-center justify-center bg-card">
        <div className="text-center">
          <p className="text-muted-foreground">Aucun projet pour le moment</p>
        </div>
      </section>
    )
  }

  const currentProject = projects[currentIndex]

  return (
    <section id="projects" className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 bg-card">
        {currentProject.images && currentProject.images.length > 0 ? (
          <div className={`absolute inset-0 transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-60"}`}>
            <Image
              src={currentProject.images[0]}
              alt={currentProject.title}
              fill
              className="object-cover"
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {/* Loading overlay */}
        {isImageLoading && currentProject.images && currentProject.images.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-card">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={prevProject}
              className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              aria-label="Projet precedent"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm">
              {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <button
              onClick={nextProject}
              className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              aria-label="Projet suivant"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <span className="font-mono text-sm text-muted-foreground">
            {currentProject.created_at ? new Date(currentProject.created_at).getFullYear() : ''}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-end px-6 md:px-12 pb-12">
          {/* Title */}
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight text-balance">
            {currentProject.title}
          </h2>
          
          {/* Role */}
          {currentProject.role && (
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              {currentProject.role}
            </p>
          )}
          
          {/* Description */}
          {currentProject.description && (
            <p className="max-w-2xl text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              {currentProject.description}
            </p>
          )}
          
          {/* Tags */}
          {currentProject.tags && currentProject.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {currentProject.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 text-xs font-mono tracking-wider border border-foreground/30 bg-background/50 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* View More Link */}
          {currentProject.discord_link && (
            <a
              href={currentProject.discord_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-mono tracking-wider hover:text-muted-foreground transition-colors"
            >
              REJOINDRE LE DISCORD
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          )}
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex 
                  ? "bg-foreground w-8" 
                  : "bg-foreground/30 hover:bg-foreground/50"
              }`}
              aria-label={`Aller au projet ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
