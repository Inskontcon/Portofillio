"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Loader2, RefreshCw } from "lucide-react"
import { Navigation } from "@/components/portfolio/navigation"
import { Footer } from "@/components/portfolio/footer"
import { createClient } from "@/lib/supabase/client"
import { fetchWithRetry } from "@/lib/fetch-with-retry"

interface Creation {
  id: string
  title: string
  description: string
  tags: string[]
  images: string[]
  video_url?: string
  created_at: string
}

export default function CreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  const loadCreations = useCallback(async () => {
    setLoading(true)
    setHasError(false)

    const supabase = createClient()

    const { data, error } = await fetchWithRetry<Creation[]>(() =>
      supabase
        .from('creations')
        .select('*')
        .order('created_at', { ascending: false })
    )

    if (error) {
      // Real error (network/DB) - do NOT wipe existing creations, show error state instead
      console.error('[v0] Error loading creations:', error)
      setHasError(true)
    } else {
      const rows = data ?? []
      setCreations(rows)
      // Initialiser les etats de chargement des images
      const loadingStates: Record<string, boolean> = {}
      rows.forEach((c: Creation) => {
        if (c.images && c.images.length > 0) {
          loadingStates[c.id] = true
        }
      })
      setImageLoadingStates(loadingStates)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadCreations()
  }, [loadCreations])

  const handleImageLoad = (creationId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [creationId]: false }))
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-muted-foreground/30 w-16" />
          <span className="font-mono text-xs tracking-widest text-muted-foreground">GALERIE</span>
        </div>
        
        <h1 className="font-display text-[10vw] md:text-[8vw] font-bold leading-none-custom tracking-tighter-custom">
          Mes Creations
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl">
          Decouvrez mes projets et realisations. Chaque creation represente un travail unique 
          alliant design et technique.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 md:px-10 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground font-mono text-sm">Chargement des creations...</span>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border">
            <div className="w-20 h-20 border border-border rounded-full flex items-center justify-center mb-6">
              <RefreshCw className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">Impossible de charger les creations</p>
            <p className="text-xs text-muted-foreground/60 mb-6">Un probleme de connexion est survenu. Veuillez reessayer.</p>
            <button
              onClick={loadCreations}
              className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-colors font-mono text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reessayer
            </button>
          </div>
        ) : creations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border">
            <div className="w-20 h-20 border border-border rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl text-muted-foreground">+</span>
            </div>
            <p className="text-muted-foreground mb-2">Aucune creation pour le moment</p>
            <p className="text-xs text-muted-foreground/60">Les creations apparaitront ici une fois ajoutees depuis la page admin</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creations.map((creation, index) => (
              <Link 
                key={creation.id}
                href={`/creations/${creation.id}`}
                className="group relative bg-card border border-border hover:border-foreground/30 transition-all duration-300 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                  {creation.images && creation.images.length > 0 ? (
                    <>
                      {imageLoadingStates[creation.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted z-5">
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      <Image
                        src={creation.images[0]}
                        alt={creation.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-contain bg-muted group-hover:scale-105 transition-all duration-700 ${
                          imageLoadingStates[creation.id] ? "opacity-0" : "opacity-100"
                        }`}
                        onLoad={() => handleImageLoad(creation.id)}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-8xl font-display font-bold opacity-10">
                        {creation.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Index */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="font-mono text-xs text-foreground/80">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Year */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="font-mono text-xs text-foreground/80">
                      {creation.created_at ? new Date(creation.created_at).getFullYear() : ''}
                    </span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 z-20 w-10 h-10 border border-foreground/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  {creation.tags && creation.tags[0] && (
                    <p className="text-xs text-muted-foreground font-mono tracking-wider mb-2">{creation.tags[0]}</p>
                  )}
                  <h3 className="font-display text-xl font-bold mb-2 text-balance">{creation.title}</h3>
                  {creation.description && (
                    <p className="text-sm text-muted-foreground/80 line-clamp-2">{creation.description}</p>
                  )}
                  
                  {/* Tags */}
                  {creation.tags && creation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {creation.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 text-[10px] font-mono border border-border text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {creation.tags.length > 3 && (
                        <span className="px-2 py-1 text-[10px] font-mono text-muted-foreground">
                          +{creation.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
