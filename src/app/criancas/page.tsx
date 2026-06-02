"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus, Search, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listarCriancas, contarCriancas } from "@/services/criancaService"
import { Crianca } from "@/types/database"

export default function CriancasPage() {
  const [criancas, setCriancas] = useState<Crianca[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [data, count] = await Promise.all([
          listarCriancas(),
          contarCriancas(),
        ])
        setCriancas(data)
        setTotal(count)
      } catch (error) {
        console.error("Erro ao carregar crianças:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredCriancas = criancas.filter((c) =>
    c.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("pt-PT")
  }

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crianças</h1>
          <p className="text-muted-foreground">
            Gestão de crianças acolhidas no lar
          </p>
        </div>
        <Link href="/criancas/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Criança
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Crianças</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criancas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crianças Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados da Pesquisa</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCriancas.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Crianças</CardTitle>
          <CardDescription>
            Todas as crianças registadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              A carregar...
            </div>
          ) : filteredCriancas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Nenhuma criança encontrada com esse nome."
                : "Nenhuma criança registada."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Foto</TableHead>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data Entrada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCriancas.map((crianca) => (
                  <TableRow key={crianca.id}>
                    <TableCell>
                      {crianca.foto_url ? (
                        <Image
                          src={crianca.foto_url}
                          alt={crianca.nome_completo}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                          {getInitials(crianca.nome_completo)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {crianca.nome_completo}
                    </TableCell>
                    <TableCell>{formatDate(crianca.data_nascimento)}</TableCell>
                    <TableCell>{crianca.sexo || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                          crianca.estado === "Ativa"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {crianca.estado || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(crianca.data_entrada)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/criancas/${crianca.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
