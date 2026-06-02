"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Pill, Activity, School, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { contarCriancas } from "@/services/criancaService"

const stats = [
  {
    title: "Crianças",
    description: "Gestão de crianças acolhidas no lar",
    icon: Users,
    href: "/criancas",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Saúde",
    description: "Registos e consultas médicas",
    icon: Heart,
    href: "/saude",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    title: "Medicação",
    description: "Gestão de medicação prescrita",
    icon: Pill,
    href: "/medicacao",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Atividades",
    description: "Atividades extracurriculares",
    icon: Activity,
    href: "/atividades",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Escolas",
    description: "Gestão escolar e matrículas",
    icon: School,
    href: "/escolas",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
]

export default function DashboardPage() {
  const [totalCriancas, setTotalCriancas] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTotal() {
      try {
        const count = await contarCriancas()
        setTotalCriancas(count)
      } catch (error) {
        console.error("Erro ao carregar total de crianças:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTotal()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do Lar Santo António
        </p>
      </div>

      {/* Stats Card */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-purple-100">
                Crianças no Lar
              </CardDescription>
              <CardTitle className="text-5xl font-bold mt-2">
                {loading ? "..." : totalCriancas}
              </CardTitle>
              <p className="text-purple-200 text-sm mt-2">
                Crianças ativas acolhidas
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-4">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/criancas">
            <Button variant="secondary" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver todas as crianças
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Módulos do Sistema</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.href} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <CardTitle>{stat.title}</CardTitle>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
