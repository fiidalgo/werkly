"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  email: string
  isEmployer: boolean
}

export function DashboardLayout({ children, email, isEmployer }: DashboardLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const main = mainRef.current
    if (!main) return

    const handleScroll = () => {
      setIsScrolled(main.scrollTop > 0)
    }

    main.addEventListener("scroll", handleScroll)
    return () => main.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar isEmployer={isEmployer} email={email} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Pinned header */}
        <header className={cn(
          "sticky top-0 z-10 flex h-14 items-center bg-white/80 backdrop-blur-sm px-6 transition-all",
          isScrolled && "border-b border-slate-200"
        )}>
          <div className="flex items-center gap-2">
            {/* TODO: placeholder werkly icon */}
            <div className="w-7 h-7 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
              W
            </div>
            <span className="text-lg font-semibold text-slate-900">Werkly</span>
          </div>
        </header>

        {/* Page content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
