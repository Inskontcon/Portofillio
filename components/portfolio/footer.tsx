export function Footer() {
  return (
    <footer className="px-6 md:px-10 py-10 border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-foreground rounded-full" />
          <span className="font-display text-lg font-bold tracking-tight">Pseudo</span>
        </div>
        
        <p className="font-mono text-xs tracking-wider text-muted-foreground">
          PORTFOLIO — 2026
        </p>
        
        <p className="font-mono text-xs tracking-wider text-muted-foreground">
          TOUS DROITS RESERVES
        </p>
      </div>
    </footer>
  )
}
