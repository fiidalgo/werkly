"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserMenu } from "./user-menu"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isEmployer: boolean
  email: string
}

interface Conversation {
  id: string
  title: string
  updated_at: string
}

export function Sidebar({ isEmployer, email }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHomeHovered, setIsHomeHovered] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  // Load conversations on mount and when pathname changes
  useEffect(() => {
    loadConversations()
  }, [pathname])

  // Listen for conversation updates
  useEffect(() => {
    const handleConversationUpdate = () => {
      loadConversations()
    }

    window.addEventListener('conversationUpdated', handleConversationUpdate)
    return () => {
      window.removeEventListener('conversationUpdated', handleConversationUpdate)
    }
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  // Save collapsed state to localStorage whenever it changes
  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  const handleNewChat = () => {
    router.push("/dashboard")
    router.refresh()
  }

  const navigation = [
    {
      name: "New chat",
      action: handleNewChat,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      showForAll: true,
      isAction: true,
    } as const,
    {
      name: "Documents",
      href: "/dashboard/documents" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      employerOnly: true,
    } as const,
    {
      name: "Employees",
      href: "/dashboard/employees" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      employerOnly: true,
    } as const,
    {
      name: "Settings",
      href: "/dashboard/settings" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      showForAll: true,
    } as const,
  ]

  const filteredNav = navigation.filter(
    (item) => item.showForAll || (item.employerOnly && isEmployer)
  )

  return (
    <div className={cn(
      "flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 overflow-hidden",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Top actions */}
      <div className="flex h-16 items-center justify-between px-3 flex-shrink-0">
        <div className="relative">
          {/* Home */}
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors",
              isCollapsed && "invisible absolute inset-0"
            )}
            tabIndex={isCollapsed ? -1 : 0}
          >
            <span className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </span>
          </Link>

          {/* Home button */}
          <button
            onClick={toggleCollapsed}
            onMouseEnter={() => setIsHomeHovered(true)}
            onMouseLeave={() => setIsHomeHovered(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors",
              !isCollapsed && "invisible absolute inset-0"
            )}
            tabIndex={isCollapsed ? 0 : -1}
          >
            <span className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                {isHomeHovered ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                )}
              </svg>
            </span>
          </button>
        </div>

        {/* Collapse button */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors",
            isCollapsed && "invisible"
          )}
          tabIndex={isCollapsed ? -1 : 0}
        >
          <span className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 py-4 overflow-hidden">
        <div className="space-y-1 flex-shrink-0">
          {filteredNav.map((item) => {
            const isActive = !item.isAction && pathname === item.href

            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="overflow-hidden whitespace-nowrap">
                    {item.name}
                  </span>
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-700 hover:bg-slate-100"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="overflow-hidden whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Conversation History */}
        {!isCollapsed && conversations.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col mt-6">
            <div className="text-xs font-semibold text-slate-500 px-3 mb-2">
              Recent Chats
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/dashboard?conversation=${conv.id}`}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors truncate"
                  title={conv.title}
                >
                  {conv.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Account settings at bottom */}
      <div className="px-3 pb-3">
        <UserMenu email={email} isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}
