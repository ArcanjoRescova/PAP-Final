"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Lê a sessão ao carregar a app para decidir acesso às rotas.
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (!session?.user && pathname !== "/login") {
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Escuta login/logout em tempo real para atualizar UI e redirecionar.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (event === "SIGNED_OUT") {
          router.push("/login")
        } else if (event === "SIGNED_IN" && pathname === "/login") {
          router.push("/")
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname])

  const logout = async () => {
    // Logout manual acionado pelos botões da interface.
    await supabase.auth.signOut()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
