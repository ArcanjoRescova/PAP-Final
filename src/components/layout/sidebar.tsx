"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Activity, Heart, Home, LayoutDashboard, Pill, School, Users } from "lucide-react"

import { cn } from "@/lib/utils"

const menuItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Crianças", href: "/criancas", icon: Users },
  { title: "Família", href: "/familia", icon: Home },
  { title: "Saúde", href: "/saude", icon: Heart },
  { title: "Medicação", href: "/medicacao", icon: Pill },
  { title: "Escolas", href: "/escolas", icon: School },
  { title: "Atividades", href: "/atividades", icon: Activity },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-b from-pink-600 via-purple-600 to-indigo-700">
      <div className="flex h-20 items-center justify-center border-b border-white/10 px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Lar Santo António"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full bg-white object-contain"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-white/60 text-center">© 2026 Lar Santo António</p>
      </div>
    </aside>
  )
}
