"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"
import { Layout } from "./layout"

export function AppWrapper({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Lar Santo António"
            width={80}
            height={80}
            className="h-20 w-20 mx-auto mb-4 rounded-full bg-white object-contain animate-pulse"
          />
          <p className="text-white text-lg">A carregar...</p>
        </div>
      </div>
    )
  }

  if (pathname === "/login") {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  return <Layout>{children}</Layout>
}
