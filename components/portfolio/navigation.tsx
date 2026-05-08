"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-2 h-2 bg-foreground rounded-full group-hover:scale-125 transition-transform" />
        <span className="font-display text-lg font-bold tracking-tight">Pseudo</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        <Link 
          href="/" 
          className={`text-sm transition-colors ${pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Accueil
        </Link>
        <Link 
          href="/creations" 
          className={`text-sm transition-colors ${pathname === '/creations' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Mes Creations
        </Link>
        <Link 
          href="#contact" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Contact
        </Link>
      </div>

      {/* Login Button */}
      <Link 
        href="/login"
        className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-foreground hover:text-background transition-colors text-sm font-medium"
      >
        <span>Connexion</span>
      </Link>
    </nav>
  )
}
