"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y)
      if (hoveredElement) {
        const computedStyle = window.getComputedStyle(hoveredElement)
        const isClickable = 
          computedStyle.cursor === "pointer" ||
          hoveredElement.tagName === "A" ||
          hoveredElement.tagName === "BUTTON" ||
          hoveredElement.closest("a") ||
          hoveredElement.closest("button") ||
          hoveredElement.getAttribute("role") === "button"
        setIsPointer(!!isClickable)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseEnter = () => setIsHidden(false)
    const handleMouseLeave = () => setIsHidden(true)

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mousemove", updateCursorType)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mousemove", updateCursorType)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [position.x, position.y])

  // Ne pas afficher sur mobile/tablette
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      {/* Cercle principal */}
      <div
        className={`fixed pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out ${
          isHidden ? "opacity-0" : "opacity-100"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isPointer ? 1.5 : 1})`,
        }}
      >
        <div
          className={`rounded-full border-2 border-white transition-all duration-200 ${
            isPointer ? "w-12 h-12 bg-white/10" : "w-6 h-6"
          }`}
        />
      </div>
      {/* Point central */}
      <div
        className={`fixed pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-100 ${
          isHidden ? "opacity-0" : "opacity-100"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className={`w-1 h-1 rounded-full bg-white transition-opacity duration-200 ${isPointer ? "opacity-0" : "opacity-100"}`} />
      </div>
    </>
  )
}
