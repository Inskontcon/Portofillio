"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, X, Upload, ArrowLeft, FolderOpen, Layers } from "lucide-react"
import { Navigation } from "@/components/portfolio/navigation"

interface Creation {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  images: string[]
  createdAt: string
}

interface Project {
  id: string
  title: string
  description: string
  role: string
  tags: string[]
  images: string[]
  discordLink: string
  createdAt: string
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
    images: [] as string[]
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
    discordLink: ""
  })

  useEffect(() => {
    // Verifier si deja authentifie dans la session
    const sessionAuth = sessionStorage.getItem("admin_authenticated")
    if (sessionAuth === "true") {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

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

  const loadData = () => {
    // Charger les creations
    const savedCreations = localStorage.getItem("portfolio_creations")
    if (savedCreations) {
      try {
        setCreations(JSON.parse(savedCreations))
      } catch {
        setCreations([])
      }
    }

    // Charger les projets
    const savedProjects = localStorage.getItem("portfolio_projects")
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects))
      } catch {
        // Projets par defaut
        const defaultProjects: Project[] = [
          {
            id: "1",
            title: "French Studios",
            description: "French Studio est un roleplay Francais qui melange WL et FA avec une WL qui est a Creteil et une FA a Lille. Je suis ravi de developper et de co-fonder le projet.",
            role: "Co-Fondateur",
            tags: ["ROBLOX", "MADE IN FRANCE", "WL-FA", "LILLE - CRETEIL"],
            images: [],
            discordLink: "https://discord.gg/uvCdpk5W24",
            createdAt: "2026"
          },
          {
            id: "2",
            title: "French Products",
            description: "Informations a venir...",
            role: "Projet",
            tags: ["ROBLOX", "MADE IN FRANCE"],
            images: [],
            discordLink: "https://discord.gg/uvCdpk5W24",
            createdAt: "2026"
          }
        ]
        setProjects(defaultProjects)
        localStorage.setItem("portfolio_projects", JSON.stringify(defaultProjects))
      }
    } else {
      // Projets par defaut
      const defaultProjects: Project[] = [
        {
          id: "1",
          title: "French Studios",
          description: "French Studio est un roleplay Francais qui melange WL et FA avec une WL qui est a Creteil et une FA a Lille. Je suis ravi de developper et de co-fonder le projet.",
          role: "Co-Fondateur",
          tags: ["ROBLOX", "MADE IN FRANCE", "WL-FA", "LILLE - CRETEIL"],
          images: [],
          discordLink: "https://discord.gg/uvCdpk5W24",
          createdAt: "2026"
        },
        {
          id: "2",
          title: "French Products",
          description: "Informations a venir...",
          role: "Projet",
          tags: ["ROBLOX", "MADE IN FRANCE"],
          images: [],
          discordLink: "https://discord.gg/uvCdpk5W24",
          createdAt: "2026"
        }
      ]
      setProjects(defaultProjects)
      localStorage.setItem("portfolio_projects", JSON.stringify(defaultProjects))
    }
  }

  // === CREATIONS ===
  const saveCreations = (newCreations: Creation[]) => {
    setCreations(newCreations)
    localStorage.setItem("portfolio_creations", JSON.stringify(newCreations))
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
        description: creation.description,
        category: creation.category,
        tags: creation.tags.join(", "),
        images: creation.images
      })
    } else {
      setEditingCreation(null)
      setCreationForm({
        title: "",
        description: "",
        category: "",
        tags: "",
        images: []
      })
    }
    setIsCreationModalOpen(true)
  }

  const closeCreationModal = () => {
    setIsCreationModalOpen(false)
    setEditingCreation(null)
  }

  const handleCreationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const sanitizedTitle = sanitizeInput(creationForm.title)
    const sanitizedDescription = sanitizeInput(creationForm.description)
    const sanitizedCategory = sanitizeInput(creationForm.category)
    
    if (!sanitizedTitle || !sanitizedDescription || !sanitizedCategory) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const tagsArray = creationForm.tags
      .split(",")
      .map(tag => sanitizeInput(tag).toUpperCase())
      .filter(Boolean)
    
    if (editingCreation) {
      const updatedCreations = creations.map(c => 
        c.id === editingCreation.id 
          ? { 
              ...c, 
              title: sanitizedTitle,
              description: sanitizedDescription,
              category: sanitizedCategory,
              tags: tagsArray,
              images: creationForm.images
            }
          : c
      )
      saveCreations(updatedCreations)
    } else {
      const newCreation: Creation = {
        id: Date.now().toString(),
        title: sanitizedTitle,
        description: sanitizedDescription,
        category: sanitizedCategory,
        tags: tagsArray,
        images: creationForm.images,
        createdAt: new Date().getFullYear().toString()
      }
      saveCreations([...creations, newCreation])
    }
    
    closeCreationModal()
  }

  const deleteCreation = (id: string) => {
    if (confirm("Etes-vous sur de vouloir supprimer cette creation ?")) {
      const updatedCreations = creations.filter(c => c.id !== id)
      saveCreations(updatedCreations)
    }
  }

  // === PROJECTS ===
  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects)
    localStorage.setItem("portfolio_projects", JSON.stringify(newProjects))
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
        description: project.description,
        role: project.role,
        tags: project.tags.join(", "),
        images: project.images,
        discordLink: project.discordLink || ""
      })
    } else {
      setEditingProject(null)
      setProjectForm({
        title: "",
        description: "",
        role: "",
        tags: "",
        images: [],
        discordLink: ""
      })
    }
    setIsProjectModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsProjectModalOpen(false)
    setEditingProject(null)
  }

  const handleProjectSubmit = (e: React.FormEvent) => {
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
      const updatedProjects = projects.map(p => 
        p.id === editingProject.id 
          ? { 
              ...p, 
              title: sanitizedTitle,
              description: sanitizedDescription,
              role: sanitizedRole,
              tags: tagsArray,
              images: projectForm.images,
              discordLink: projectForm.discordLink
            }
          : p
      )
      saveProjects(updatedProjects)
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: sanitizedTitle,
        description: sanitizedDescription,
        role: sanitizedRole,
        tags: tagsArray,
        images: projectForm.images,
        discordLink: projectForm.discordLink,
        createdAt: new Date().getFullYear().toString()
      }
      saveProjects([...projects, newProject])
    }
    
    closeProjectModal()
  }

  const deleteProject = (id: string) => {
    if (confirm("Etes-vous sur de vouloir supprimer ce projet ?")) {
      const updatedProjects = projects.filter(p => p.id !== id)
      saveProjects(updatedProjects)
    }
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
              <p className="text-muted-foreground mt-2">Gerez vos creations et projets</p>
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
                        {creation.images.length > 0 ? (
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
                        <div className="font-mono text-xs text-muted-foreground mb-1">{creation.category}</div>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      className="group relative border border-border bg-card overflow-hidden"
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {project.images.length > 0 ? (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={closeCreationModal} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card z-10">
              <h2 className="font-display text-2xl font-bold">
                {editingCreation ? "Modifier la creation" : "Nouvelle creation"}
              </h2>
              <button onClick={closeCreationModal} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
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
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">CATEGORIE *</label>
                <input
                  type="text"
                  value={creationForm.category}
                  onChange={(e) => setCreationForm({ ...creationForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="Ex: Vehicule, Building, etc."
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">DESCRIPTION *</label>
                <textarea
                  value={creationForm.description}
                  onChange={(e) => setCreationForm({ ...creationForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none resize-none h-32"
                  placeholder="Decrivez votre creation..."
                  required
                  maxLength={1000}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">TAGS</label>
                <input
                  type="text"
                  value={creationForm.tags}
                  onChange={(e) => setCreationForm({ ...creationForm, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="ROBLOX, VEHICULE, etc. (separes par des virgules)"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">IMAGES</label>
                {creationForm.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {creationForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-video bg-muted group">
                        <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeCreationImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-foreground text-background text-xs font-mono">PRINCIPALE</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-3 p-6 border border-dashed border-border hover:border-foreground cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Cliquez pour ajouter des images (max 5MB)</span>
                  <input type="file" accept="image/*" multiple onChange={handleCreationImageUpload} className="hidden" />
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeCreationModal} className="flex-1 px-6 py-3 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-6 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
                  {editingCreation ? "Enregistrer" : "Creer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={closeProjectModal} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card z-10">
              <h2 className="font-display text-2xl font-bold">
                {editingProject ? "Modifier le projet" : "Nouveau projet"}
              </h2>
              <button onClick={closeProjectModal} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
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
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">ROLE *</label>
                <input
                  type="text"
                  value={projectForm.role}
                  onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="Ex: Co-Fondateur, UI Designer, etc."
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">DESCRIPTION *</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none resize-none h-32"
                  placeholder="Decrivez le projet..."
                  required
                  maxLength={1000}
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
                  value={projectForm.discordLink}
                  onChange={(e) => setProjectForm({ ...projectForm, discordLink: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-foreground transition-colors outline-none"
                  placeholder="https://discord.gg/..."
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-wider text-muted-foreground mb-2">IMAGES DU PROJET</label>
                {projectForm.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {projectForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-video bg-muted group">
                        <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeProjectImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-foreground text-background text-xs font-mono">PRINCIPALE</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-3 p-6 border border-dashed border-border hover:border-foreground cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Cliquez pour ajouter des images (max 5MB)</span>
                  <input type="file" accept="image/*" multiple onChange={handleProjectImageUpload} className="hidden" />
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeProjectModal} className="flex-1 px-6 py-3 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-6 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
                  {editingProject ? "Enregistrer" : "Creer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
