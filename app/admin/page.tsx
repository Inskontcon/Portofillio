"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, X, Upload, ArrowLeft, FolderOpen, Layers, Loader2 } from "lucide-react"
import { Navigation } from "@/components/portfolio/navigation"
import { createClient } from "@/lib/supabase/client"

interface Creation {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  images: string[]
  video_url?: string
  created_at: string
}

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

// Fonction de validation des entrees
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .replace(/javascript:/gi, '') // Supprime les tentatives de JS injection
    .replace(/on\w+=/gi, '') // Supprime les event handlers
    .trim()
}

const validateImageData = (data: string): boolean => {
  // Verifie que c'est bien une image base64 valide
  return data.startsWith('data:image/') && data.includes('base64,')
}

const ADMIN_PASSWORD = "lille1234"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [activeTab, setActiveTab] = useState<"creations" | "projects">("creations")
  
  // Creations state
  const [creations, setCreations] = useState<Creation[]>([])
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
  const [editingCreation, setEditingCreation] = useState<Creation | null>(null)
  const [creationForm, setCreationForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    images: [] as string[],
    video_url: ""
  })

  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    role: "",
    tags: "",
    images: [] as string[],
    discord_link: ""
  })

  const supabase = createClient()

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Charger les creations depuis Supabase
      const { data: creationsData, error: creationsError } = await supabase
        .from('creations')
        .select('*')
        .order('created_at', { ascending: false })

      if (creationsError) {
        console.error('Error loading creations:', creationsError)
      } else {
        setCreations(creationsData?.map(c => ({
          ...c,
          category: c.tags?.[0] || 'MODELISATION'
        })) || [])
      }

      // Charger les projets depuis Supabase
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) {
        console.error('Error loading projects:', projectsError)
      } else {
        setProjects(projectsData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // Verifier si deja authentifie dans la session
    const sessionAuth = sessionStorage.getItem("admin_authenticated")
    if (sessionAuth === "true") {
      setIsAuthenticated(true)
      loadData()
    }
  }, [loadData])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError(false)
      sessionStorage.setItem("admin_authenticated", "true")
      loadData()
    } else {
      setPasswordError(true)
    }
  }

  // === CREATIONS ===
  const saveCreation = async (creation: Omit<Creation, 'id' | 'created_at'>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('creations')
        .insert({
          title: creation.title,
          description: creation.description,
          tags: creation.tags,
          images: creation.images,
          video_url: creation.video_url
        })

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error saving creation:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const updateCreation = async (id: string, creation: Partial<Creation>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('creations')
        .update({
          title: creation.title,
          description: creation.description,
          tags: creation.tags,
          images: creation.images,
          video_url: creation.video_url
        })
        .eq('id', id)

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error updating creation:', error)
      alert('Erreur lors de la mise a jour')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCreation = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer cette creation ?")) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('creations')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error deleting creation:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreationImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        // Limite de taille: 5MB
        if (file.size > 5 * 1024 * 1024) {
          alert("L'image est trop volumineuse (max 5MB)")
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          if (validateImageData(result)) {
            setCreationForm(prev => ({
              ...prev,
              images: [...prev.images, result]
            }))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeCreationImage = (index: number) => {
    setCreationForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const openCreationModal = (creation?: Creation) => {
    if (creation) {
      setEditingCreation(creation)
      setCreationForm({
        title: creation.title,
        description: creation.description || "",
        category: creation.category || creation.tags?.[0] || "",
        tags: creation.tags?.join(", ") || "",
        images: creation.images || [],
        video_url: creation.video_url || ""
      })
    } else {
      setEditingCreation(null)
      setCreationForm({
        title: "",
        description: "",
        category: "",
        tags: "",
        images: [],
        video_url: ""
      })
    }
    setIsCreationModalOpen(true)
  }

  const closeCreationModal = () => {
    setIsCreationModalOpen(false)
    setEditingCreation(null)
  }

  const handleCreationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const sanitizedTitle = sanitizeInput(creationForm.title)
    const sanitizedDescription = sanitizeInput(creationForm.description)
    const sanitizedCategory = sanitizeInput(creationForm.category)
    
    if (!sanitizedTitle || !sanitizedDescription || !sanitizedCategory) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const tagsArray = [sanitizedCategory, ...creationForm.tags
      .split(",")
      .map(tag => sanitizeInput(tag).toUpperCase())
      .filter(Boolean)
      .filter(tag => tag !== sanitizedCategory.toUpperCase())]
    
    if (editingCreation) {
      await updateCreation(editingCreation.id, {
        title: sanitizedTitle,
        description: sanitizedDescription,
        tags: tagsArray,
        images: creationForm.images,
        video_url: creationForm.video_url
      })
    } else {
      await saveCreation({
        title: sanitizedTitle,
        description: sanitizedDescription,
        category: sanitizedCategory,
        tags: tagsArray,
        images: creationForm.images,
        video_url: creationForm.video_url
      })
    }
    
    closeCreationModal()
  }

  // === PROJECTS ===
  const saveProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          title: project.title,
          description: project.description,
          role: project.role,
          tags: project.tags,
          images: project.images,
          discord_link: project.discord_link
        })

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProject = async (id: string, project: Partial<Project>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: project.title,
          description: project.description,
          role: project.role,
          tags: project.tags,
          images: project.images,
          discord_link: project.discord_link
        })
        .eq('id', id)

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Erreur lors de la mise a jour')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce projet ?")) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert("L'image est trop volumineuse (max 5MB)")
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          if (validateImageData(result)) {
            setProjectForm(prev => ({
              ...prev,
              images: [...prev.images, result]
            }))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeProjectImage = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const openProjectModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setProjectForm({
        title: project.title,
        description: project.description || "",
        role: project.role || "",
        tags: project.tags?.join(", ") || "",
        images: project.images || [],
        discord_link: project.discord_link || ""
      })
    } else {
      setEditingProject(null)
      setProjectForm({
        title: "",
        description: "",
        role: "",
        tags: "",
        images: [],
        discord_link: ""
      })
    }
    setIsProjectModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsProjectModalOpen(false)
    setEditingProject(null)
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const sanitizedTitle = sanitizeInput(projectForm.title)
    const sanitizedDescription = sanitizeInput(projectForm.description)
    const sanitizedRole = sanitizeInput(projectForm.role)
    
    if (!sanitizedTitle || !sanitizedDescription || !sanitizedRole) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const tagsArray = projectForm.tags
      .split(",")
      .map(tag => sanitizeInput(tag).toUpperCase())
      .filter(Boolean)
    
    if (editingProject) {
      await updateProject(editingProject.id, {
        title: sanitizedTitle,
        description: sanitizedDescription,
        role: sanitizedRole,
        tags: tagsArray,
        images: projectForm.images,
        discord_link: projectForm.discord_link
      })
    } else {
      await saveProject({
        title: sanitizedTitle,
        description: sanitizedDescription,
        role: sanitizedRole,
        tags: tagsArray,
        images: projectForm.images,
        discord_link: projectForm.discord_link
      })
    }
    
    closeProjectModal()
  }

  // Ecran de connexion
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <Navigation />
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Administration</h1>
            <p className="text-muted-foreground text-sm">Entrez le mot de passe pour acceder au panneau</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">MOT DE PASSE</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setPasswordError(false)
                }}
                className={`w-full px-4 py-3 bg-background border ${passwordError ? 'border-red-500' : 'border-border'} focus:border-foreground transition-colors outline-none`}
                placeholder="Entrez le mot de passe..."
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-2 font-mono">Mot de passe incorrect</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
            >
              Se connecter
            </button>
          </form>
          <div className="text-center mt-6">
            <Link 
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-mono"
            >
              Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      <Navigation />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Link 
                  href="/"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-mono text-xs">RETOUR</span>
                </Link>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">Administration</h1>
              <p className="text-muted-foreground mt-2">Gerez vos creations et projets (Supabase)</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("creations")}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-colors border-b-2 -mb-px ${
                activeTab === "creations" 
                  ? "border-foreground text-foreground" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Creations
              <span className="px-2 py-0.5 bg-muted text-xs">{creations.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-colors border-b-2 -mb-px ${
                activeTab === "projects" 
                  ? "border-foreground text-foreground" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-4 h-4" />
              Projets (Accueil)
              <span className="px-2 py-0.5 bg-muted text-xs">{projects.length}</span>
            </button>
          </div>

          {/* CREATIONS TAB */}
          {activeTab === "creations" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Les creations apparaissent sur la page /creations
                </p>
                <button
                  onClick={() => openCreationModal()}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle creation
                </button>
              </div>

              {creations.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border">
                  <p className="text-muted-foreground mb-4">Aucune creation pour le moment</p>
                  <button
                    onClick={() => openCreationModal()}
                    className="text-foreground underline underline-offset-4 hover:no-underline"
                  >
                    Ajouter votre premiere creation
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creations.map((creation) => (
                    <div 
                      key={creation.id}
                      className="group relative border border-border bg-card overflow-hidden"
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {creation.images && creation.images.length > 0 ? (
                          <Image
                            src={creation.images[0]}
                            alt={creation.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <span className="font-mono text-xs">PAS D&apos;IMAGE</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button
                            onClick={() => openCreationModal(creation)}
                            className="p-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteCreation(creation.id)}
                            className="p-3 bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="font-mono text-xs text-muted-foreground mb-1">{creation.category || creation.tags?.[0]}</div>
                        <h3 className="font-display text-lg font-bold mb-2">{creation.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{creation.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Les projets apparaissent sur la page d&apos;accueil
                </p>
                <button
                  onClick={() => openProjectModal()}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nouveau projet
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border">
                  <p className="text-muted-foreground mb-4">Aucun projet pour le moment</p>
                  <button
                    onClick={() => openProjectModal()}
                    className="text-foreground underline underline-offset-4 hover:no-underline"
                  >
                    Ajouter votre premier projet
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      className="group relative border border-border bg-card overflow-hidden"
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {project.images && project.images.length > 0 ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <span className="font-mono text-xs">PAS D&apos;IMAGE</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button
                            onClick={() => openProjectModal(project)}
                            className="p-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-3 bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="font-mono text-xs text-muted-foreground mb-1">{project.role}</div>
                        <h3 className="font-display text-lg font-bold mb-2">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        {project.discord_link && (
                          <p className="text-xs text-muted-foreground mt-2 font-mono truncate">Discord: {project.discord_link}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Creation Modal */}
      {isCreationModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold">
                {editingCreation ? "Modifier la creation" : "Nouvelle creation"}
              </h2>
              <button onClick={closeCreationModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreationSubmit} className="p-6 space-y-6">
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">TITRE *</label>
                <input
                  type="text"
                  value={creationForm.title}
                  onChange={(e) => setCreationForm({ ...creationForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="Nom de la creation"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">DESCRIPTION *</label>
                <textarea
                  value={creationForm.description}
                  onChange={(e) => setCreationForm({ ...creationForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none min-h-[100px] resize-none"
                  placeholder="Description de la creation"
                  maxLength={500}
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">CATEGORIE *</label>
                <input
                  type="text"
                  value={creationForm.category}
                  onChange={(e) => setCreationForm({ ...creationForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="MODELISATION, BUILD, etc."
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">TAGS</label>
                <input
                  type="text"
                  value={creationForm.tags}
                  onChange={(e) => setCreationForm({ ...creationForm, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="BLENDER, ROBLOX, etc. (separes par des virgules)"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">URL VIDEO (optionnel)</label>
                <input
                  type="url"
                  value={creationForm.video_url}
                  onChange={(e) => setCreationForm({ ...creationForm, video_url: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="https://youtube.com/..."
                  maxLength={500}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">IMAGES</label>
                <div className="border border-dashed border-border p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCreationImageUpload}
                    className="hidden"
                    id="creation-images"
                  />
                  <label htmlFor="creation-images" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cliquez pour ajouter des images</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB par image</p>
                  </label>
                </div>
                {creationForm.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {creationForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image src={img} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeCreationImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeCreationModal}
                  className="flex-1 px-6 py-3 border border-border hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                >
                  {editingCreation ? "Mettre a jour" : "Creer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold">
                {editingProject ? "Modifier le projet" : "Nouveau projet"}
              </h2>
              <button onClick={closeProjectModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProjectSubmit} className="p-6 space-y-6">
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">TITRE *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="Nom du projet"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">DESCRIPTION *</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none min-h-[100px] resize-none"
                  placeholder="Description du projet"
                  maxLength={500}
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">ROLE *</label>
                <input
                  type="text"
                  value={projectForm.role}
                  onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="Co-Fondateur, Developpeur, etc."
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">TAGS</label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="ROBLOX, MADE IN FRANCE, etc."
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">LIEN DISCORD</label>
                <input
                  type="url"
                  value={projectForm.discord_link}
                  onChange={(e) => setProjectForm({ ...projectForm, discord_link: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="https://discord.gg/..."
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">IMAGES DU PROJET</label>
                <div className="border border-dashed border-border p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProjectImageUpload}
                    className="hidden"
                    id="project-images"
                  />
                  <label htmlFor="project-images" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cliquez pour ajouter des images</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB par image</p>
                  </label>
                </div>
                {projectForm.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {projectForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image src={img} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeProjectImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeProjectModal}
                  className="flex-1 px-6 py-3 border border-border hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                >
                  {editingProject ? "Mettre a jour" : "Creer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
