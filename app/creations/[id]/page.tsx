"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ChevronLeft, Loader2, ZoomIn } from "lucide-react"
import { Navigation } from "@/components/portfolio/navigation"
import { Footer } from "@/components/portfolio/footer"
import { ImageLightbox } from "@/components/image-lightbox"

interface Creation {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  images: string[]
  createdAt: string
}

export default function CreationDetailPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [creation, setCreation] = useState<Creation | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  
  useEffect(() => {
    const loadCreation = () => {
      setLoading(true)
      const savedCreations = localStorage.getItem("portfolio_creations")
      if (savedCreations) {
        try {
          const creations: Creation[] = JSON.parse(savedCreations)
          const found = creations.find(c => c.id === params.id)
          setCreation(found || null)
        } catch {
          setCreation(null)
        }
      }
      setLoading(false)
    }
    
    loadCreation()
    
    // Ecouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio_creations") {
        loadCreation()
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [params.id])
  
  // Reset image loading state when switching images
  useEffect(() => {
    setImageLoading(true)
  }, [currentImageIndex])
  
  if (loading) {
    return (
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground font-mono text-sm">Chargement de la creation...</span>
        </div>
        <Footer />
      </main>
    )
  }

  if (!creation) {
    return (
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <h1 className="font-display text-4xl font-bold mb-4">Creation introuvable</h1>
          <p className="text-muted-foreground mb-6">Cette creation n&apos;existe pas ou a ete supprimee.</p>
          <Link href="/creations" className="px-6 py-3 border border-border hover:border-foreground transition-colors">
            Retour aux creations
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const nextImage = () => {
    if (creation.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === creation.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (creation.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? creation.images.length - 1 : prev - 1
      )
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      
      {/* Back button */}
      <div className="pt-28 px-6 md:px-10">
        <Link 
          href="/creations"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Retour aux creations</span>
        </Link>
      </div>

      {/* Main content */}
      <section className="py-12 px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="relative">
            <div 
              className="relative aspect-[4/3] bg-card border border-border overflow-hidden group cursor-pointer"
              onClick={() => creation.images && creation.images.length > 0 && setIsLightboxOpen(true)}
            >
              {creation.images && creation.images.length > 0 && creation.images[currentImageIndex] ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <Image
                    src={creation.images[currentImageIndex]}
                    alt={`${creation.title} - Image ${currentImageIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-contain bg-muted transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => setImageLoading(false)}
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border">
                      <ZoomIn className="w-5 h-5" />
                      <span className="font-mono text-sm">Cliquer pour zoomer</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-8xl font-display font-bold opacity-10">
                    {creation.title.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation arrows */}
            {creation.images && creation.images.length > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button 
                  onClick={prevImage}
                  className="w-12 h-12 border border-border hover:border-foreground flex items-center justify-center transition-colors"
                  aria-label="Image precedente"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm">
                    {String(currentImageIndex + 1).padStart(2, '0')} / {String(creation.images.length).padStart(2, '0')}
                  </span>
                </div>
                
                <button 
                  onClick={nextImage}
                  className="w-12 h-12 border border-border hover:border-foreground flex items-center justify-center transition-colors"
                  aria-label="Image suivante"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Thumbnails */}
            {creation.images && creation.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {creation.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-16 flex-shrink-0 border transition-colors overflow-hidden ${
                      index === currentImageIndex 
                        ? 'border-foreground' 
                        : 'border-border hover:border-foreground/50'
                    }`}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={`Miniature ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              {creation.category && (
                <span className="font-mono text-xs tracking-widest text-muted-foreground">{creation.category}</span>
              )}
              {creation.createdAt && (
                <span className="font-mono text-xs tracking-widest text-muted-foreground">{creation.createdAt}</span>
              )}
            </div>
            
            <h1 className="font-display text-[8vw] md:text-[4vw] font-bold leading-none-custom tracking-tighter-custom mb-6 text-balance">
              {creation.title}
            </h1>
            
            {creation.description && (
              <p className="text-muted-foreground leading-relaxed mb-8">
                {creation.description}
              </p>
            )}
            
            {/* Tags */}
            {creation.tags && creation.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {creation.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-4 py-2 text-xs font-mono border border-border text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Separator */}
            <div className="h-px bg-border my-8" />

            {/* Additional info */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {creation.category && (
                  <div>
                    <p className="text-muted-foreground mb-1">Categorie</p>
                    <p>{creation.category}</p>
                  </div>
                )}
                {creation.createdAt && (
                  <div>
                    <p className="text-muted-foreground mb-1">Annee</p>
                    <p>{creation.createdAt}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">Images</p>
                  <p>{creation.images?.length || 0} photo(s)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {creation.images && creation.images.length > 0 && (
        <ImageLightbox
          src={creation.images[currentImageIndex]}
          alt={`${creation.title} - Image ${currentImageIndex + 1}`}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </main>
  )
}
