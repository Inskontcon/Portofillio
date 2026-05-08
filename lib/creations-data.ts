// Types pour les créations
export interface Creation {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  images: string[]
  createdAt: string
}

// Données d'exemple - à remplacer par tes propres créations
export const creationsData: Creation[] = [
  {
    id: "1",
    title: "French Studios",
    description: "French Studio est un roleplay Français qui mélange WL et FA avec une WL qui est à Créteil et une FA à Lille. Je suis ravi de développer et de co-fonder le projet.",
    category: "Co-Fondateur",
    tags: ["ROBLOX", "MADE IN FRANCE", "WL-FA", "LILLE - CRÉTEIL"],
    images: [
      "/creations/french-studios-1.jpg",
      "/creations/french-studios-2.jpg",
      "/creations/french-studios-3.jpg"
    ],
    createdAt: "2026"
  },
  {
    id: "2",
    title: "French Products",
    description: "Informations à venir...",
    category: "Projet",
    tags: ["ROBLOX", "MADE IN FRANCE"],
    images: [
      "/creations/french-products-1.jpg",
      "/creations/french-products-2.jpg"
    ],
    createdAt: "2026"
  }
]

// Fonction pour ajouter une création (sera connectée à une base de données plus tard)
export function addCreation(creation: Omit<Creation, 'id' | 'createdAt'>): Creation {
  const newCreation: Creation = {
    ...creation,
    id: Date.now().toString(),
    createdAt: new Date().getFullYear().toString()
  }
  return newCreation
}
