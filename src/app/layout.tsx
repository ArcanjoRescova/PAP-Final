import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { AppWrapper } from "@/components/layout/AppWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lar Santo António - Sistema de Gestão",
  description: "Sistema de gestão interno para o Lar de Santo António da Cidade de Santarém",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <AuthProvider>
          <AppWrapper>{children}</AppWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
