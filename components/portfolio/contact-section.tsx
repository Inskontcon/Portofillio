"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="relative min-h-[60vh] flex flex-col justify-center px-6 md:px-10 py-20">
      {/* Large text */}
      <div className="mb-16">
        <p className="font-mono text-xs tracking-widest text-muted-foreground mb-6">(03) CONTACT</p>
        <h2 className="font-display text-[8vw] md:text-[6vw] font-bold leading-none tracking-tighter">
          Un projet en tete ?
        </h2>
        <h2 className="font-display text-[8vw] md:text-[6vw] font-bold leading-none tracking-tighter text-outline mt-2">
          Discutons-en.
        </h2>
      </div>

      {/* Contact links */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-16">
        <Link 
          href="https://discord.gg/uvCdpk5W24" 
          target="_blank"
          className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="font-mono text-sm tracking-wider">DISCORD</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
