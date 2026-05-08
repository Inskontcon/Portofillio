"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection directe vers le panel admin
    router.push("/admin")
  }, [router])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground font-mono text-sm">Redirection vers le panel...</span>
      </div>
    </main>
  )
}
