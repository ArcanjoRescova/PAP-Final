"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  Plus,
  Search,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  listarEscolas,
  listarMatriculas,
  listarAssiduidade,
  listarAvaliacoes,
  criarEscola,
  criarMatricula,
  criarAssiduidade,
  criarAvaliacao,
  contarEscolas,
  contarMatriculas,
  type MatriculaComRelacoes,
  type AssiduidadeComRelacoes,
  type AvaliacaoComRelacoes,
} from "@/services/escolaService"
import { listarCriancas } from "@/services/criancaService"
import type { Escola, Crianca } from "@/types/database"

export default function EscolasPage() {
  const [escolas, setEscolas] = useState<Escola[]>([])
  const [matriculas, setMatriculas] = useState<MatriculaComRelacoes[]>([])
  const [assiduidade, setAssiduidade] = useState<AssiduidadeComRelacoes[]>([])
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoComRelacoes[]>([])
  const [criancas, setCriancas] = useState<Crianca[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [totalEscolas, setTotalEscolas] = useState(0)
  const [totalMatriculas, setTotalMatriculas] = useState(0)

  const [dialogEscolaOpen, setDialogEscolaOpen] = useState(false)
  const [dialogMatriculaOpen, setDialogMatriculaOpen] = useState(false)
  const [dialogAssiduidadeOpen, setDialogAssiduidadeOpen] = useState(false)
  const [dialogAvaliacaoOpen, setDialogAvaliacaoOpen] = useState(false)

  const [novaEscola, setNovaEscola] = useState({
    nome: "",
    morada: "",
    telefone: "",
    email: "",
    observacoes: "",
  })

  const [novaMatricula, setNovaMatricula] = useState({
    crianca_id: "",
    escola_id: "",
    ano_letivo: "",
    turma: "",
    nivel: "",
    horario_descricao: "",
    data_inicio: "",
    data_fim: "",
    observacoes: "",
  })

  const [novaAssiduidade, setNovaAssiduidade] = useState({
    crianca_id: "",
    data: "",
    periodo: "",
    estado: "",
    justificacao: "",
  })

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    crianca_id: "",
    ano_letivo: "",
    disciplina: "",
    periodo: "",
    nota: "",
    observacoes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [
        escolasData,
        matriculasData,
        assiduidadeData,
        avaliacoesData,
        criancasData,
        countEscolas,
        countMatriculas,
      ] = await Promise.all([
        listarEscolas(),
        listarMatriculas(),
        listarAssiduidade(),
        listarAvaliacoes(),
        listarCriancas(),
        contarEscolas(),
        contarMatriculas(),
      ])
      setEscolas(escolasData)
      setMatriculas(matriculasData)
      setAssiduidade(assiduidadeData)
      setAvaliacoes(avaliacoesData)
      setCriancas(criancasData)
      setTotalEscolas(countEscolas)
      setTotalMatriculas(countMatriculas)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("pt-PT")
  }

  async function handleCriarEscola() {
    try {
      await criarEscola({
        nome: novaEscola.nome,
        morada: novaEscola.morada || null,
        telefone: novaEscola.telefone || null,
        email: novaEscola.email || null,
        observacoes: novaEscola.observacoes || null,
      })
      setDialogEscolaOpen(false)
      setNovaEscola({ nome: "", morada: "", telefone: "", email: "", observacoes: "" })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar escola:", error)
    }
  }

  async function handleCriarMatricula() {
    try {
      await criarMatricula({
        crianca_id: novaMatricula.crianca_id,
        escola_id: novaMatricula.escola_id,
        ano_letivo: novaMatricula.ano_letivo,
        turma: novaMatricula.turma || null,
        nivel: novaMatricula.nivel || null,
        horario_descricao: novaMatricula.horario_descricao || null,
        data_inicio: novaMatricula.data_inicio || null,
        data_fim: novaMatricula.data_fim || null,
        observacoes: novaMatricula.observacoes || null,
      })
      setDialogMatriculaOpen(false)
      setNovaMatricula({
        crianca_id: "",
        escola_id: "",
        ano_letivo: "",
        turma: "",
        nivel: "",
        horario_descricao: "",
        data_inicio: "",
        data_fim: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar matrícula:", error)
    }
  }

  async function handleCriarAssiduidade() {
    try {
      await criarAssiduidade({
        crianca_id: novaAssiduidade.crianca_id,
        data: novaAssiduidade.data,
        periodo: novaAssiduidade.periodo || null,
        estado: novaAssiduidade.estado,
        justificacao: novaAssiduidade.justificacao || null,
      })
      setDialogAssiduidadeOpen(false)
      setNovaAssiduidade({
        crianca_id: "",
        data: "",
        periodo: "",
        estado: "",
        justificacao: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar assiduidade:", error)
    }
  }

  async function handleCriarAvaliacao() {
    try {
      await criarAvaliacao({
        crianca_id: novaAvaliacao.crianca_id,
        ano_letivo: novaAvaliacao.ano_letivo,
        disciplina: novaAvaliacao.disciplina,
        periodo: novaAvaliacao.periodo || null,
        nota: novaAvaliacao.nota || null,
        observacoes: novaAvaliacao.observacoes || null,
      })
      setDialogAvaliacaoOpen(false)
      setNovaAvaliacao({
        crianca_id: "",
        ano_letivo: "",
        disciplina: "",
        periodo: "",
        nota: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar avaliação:", error)
    }
  }

  const filteredEscolas = escolas.filter(
    (e) =>
      e.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.morada?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMatriculas = matriculas.filter(
    (m) =>
      m.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.escola?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAssiduidade = assiduidade.filter((a) =>
    a.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAvaliacoes = avaliacoes.filter(
    (a) =>
      a.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.disciplina?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentYear = new Date().getFullYear()
  const anosLetivos = [
    `${currentYear}/${currentYear + 1}`,
    `${currentYear - 1}/${currentYear}`,
    `${currentYear - 2}/${currentYear - 1}`,
  ]

  const niveis = [
    "1º ano", "2º ano", "3º ano", "4º ano",
    "5º ano", "6º ano", "7º ano", "8º ano", "9º ano",
    "10º ano", "11º ano", "12º ano",
    "Pré-escolar", "Outro",
  ]

  const periodos = ["Manhã", "Tarde", "Dia Inteiro"]
  const estadosAssiduidade = ["Presente", "Falta Justificada", "Falta Injustificada"]
  const periodosAvaliacao = ["1º Período", "2º Período", "3º Período", "Final"]
  const disciplinas = [
    "Português", "Matemática", "Inglês", "História", "Geografia",
    "Ciências", "Físico-Química", "Educação Física", "Artes", "Música", "Outra",
  ]

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "Presente":
        return "bg-green-100 text-green-800"
      case "Falta Justificada":
        return "bg-yellow-100 text-yellow-800"
      case "Falta Injustificada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolas</h1>
          <p className="text-muted-foreground">
            Gestão escolar: escolas, matrículas, assiduidade e avaliações
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEscolas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matrículas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatriculas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registos Assiduidade</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assiduidade.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avaliacoes.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="escolas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="escolas" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Escolas
          </TabsTrigger>
          <TabsTrigger value="matriculas" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Matrículas
          </TabsTrigger>
          <TabsTrigger value="assiduidade" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Assiduidade
          </TabsTrigger>
          <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Avaliações
          </TabsTrigger>
        </TabsList>

        {/* TAB ESCOLAS */}
        <TabsContent value="escolas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Escolas</CardTitle>
                <CardDescription>Lista de escolas registadas</CardDescription>
              </div>
              <Dialog open={dialogEscolaOpen} onOpenChange={setDialogEscolaOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Escola
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nova Escola</DialogTitle>
                    <DialogDescription>Adicione uma nova escola</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input
                        value={novaEscola.nome}
                        onChange={(e) => setNovaEscola({ ...novaEscola, nome: e.target.value })}
                        placeholder="Nome da escola"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Morada</Label>
                      <Input
                        value={novaEscola.morada}
                        onChange={(e) => setNovaEscola({ ...novaEscola, morada: e.target.value })}
                        placeholder="Morada completa"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={novaEscola.telefone}
                          onChange={(e) => setNovaEscola({ ...novaEscola, telefone: e.target.value })}
                          placeholder="912345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={novaEscola.email}
                          onChange={(e) => setNovaEscola({ ...novaEscola, email: e.target.value })}
                          placeholder="email@escola.pt"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogEscolaOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCriarEscola} disabled={!novaEscola.nome}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredEscolas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma escola encontrada.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Morada</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEscolas.map((escola) => (
                      <TableRow key={escola.id}>
                        <TableCell className="font-medium">{escola.nome}</TableCell>
                        <TableCell>{escola.morada || "-"}</TableCell>
                        <TableCell>{escola.telefone || "-"}</TableCell>
                        <TableCell>{escola.email || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB MATRÍCULAS */}
        <TabsContent value="matriculas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Matrículas</CardTitle>
                <CardDescription>Matrículas das crianças</CardDescription>
              </div>
              <Dialog open={dialogMatriculaOpen} onOpenChange={setDialogMatriculaOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Matrícula
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Nova Matrícula</DialogTitle>
                    <DialogDescription>Matricule uma criança</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Criança *</Label>
                        <Select value={novaMatricula.crianca_id} onValueChange={(v) => setNovaMatricula({ ...novaMatricula, crianca_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {criancas.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Escola *</Label>
                        <Select value={novaMatricula.escola_id} onValueChange={(v) => setNovaMatricula({ ...novaMatricula, escola_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {escolas.map((e) => (<SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Ano Letivo *</Label>
                        <Select value={novaMatricula.ano_letivo} onValueChange={(v) => setNovaMatricula({ ...novaMatricula, ano_letivo: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {anosLetivos.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Nível</Label>
                        <Select value={novaMatricula.nivel} onValueChange={(v) => setNovaMatricula({ ...novaMatricula, nivel: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {niveis.map((n) => (<SelectItem key={n} value={n}>{n}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Turma</Label>
                        <Input value={novaMatricula.turma} onChange={(e) => setNovaMatricula({ ...novaMatricula, turma: e.target.value })} placeholder="Ex: A" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogMatriculaOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCriarMatricula} disabled={!novaMatricula.crianca_id || !novaMatricula.escola_id || !novaMatricula.ano_letivo}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredMatriculas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma matrícula encontrada.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criança</TableHead>
                      <TableHead>Escola</TableHead>
                      <TableHead>Ano Letivo</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Turma</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatriculas.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.crianca?.nome_completo || "-"}</TableCell>
                        <TableCell>{m.escola?.nome || "-"}</TableCell>
                        <TableCell><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">{m.ano_letivo}</span></TableCell>
                        <TableCell>{m.nivel || "-"}</TableCell>
                        <TableCell>{m.turma || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB ASSIDUIDADE */}
        <TabsContent value="assiduidade">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assiduidade</CardTitle>
                <CardDescription>Registo de presenças e faltas</CardDescription>
              </div>
              <Dialog open={dialogAssiduidadeOpen} onOpenChange={setDialogAssiduidadeOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Registo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Novo Registo de Assiduidade</DialogTitle>
                    <DialogDescription>Registe presença ou falta</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Criança *</Label>
                      <Select value={novaAssiduidade.crianca_id} onValueChange={(v) => setNovaAssiduidade({ ...novaAssiduidade, crianca_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent>
                          {criancas.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data *</Label>
                        <Input type="date" value={novaAssiduidade.data} onChange={(e) => setNovaAssiduidade({ ...novaAssiduidade, data: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Período</Label>
                        <Select value={novaAssiduidade.periodo} onValueChange={(v) => setNovaAssiduidade({ ...novaAssiduidade, periodo: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {periodos.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Estado *</Label>
                      <Select value={novaAssiduidade.estado} onValueChange={(v) => setNovaAssiduidade({ ...novaAssiduidade, estado: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent>
                          {estadosAssiduidade.map((e) => (<SelectItem key={e} value={e}>{e}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Justificação</Label>
                      <Input value={novaAssiduidade.justificacao} onChange={(e) => setNovaAssiduidade({ ...novaAssiduidade, justificacao: e.target.value })} placeholder="Motivo da falta (se aplicável)" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogAssiduidadeOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCriarAssiduidade} disabled={!novaAssiduidade.crianca_id || !novaAssiduidade.data || !novaAssiduidade.estado}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredAssiduidade.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhum registo encontrado.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criança</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Justificação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssiduidade.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.crianca?.nome_completo || "-"}</TableCell>
                        <TableCell>{formatDate(a.data)}</TableCell>
                        <TableCell>{a.periodo || "-"}</TableCell>
                        <TableCell><span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeClass(a.estado)}`}>{a.estado}</span></TableCell>
                        <TableCell className="max-w-xs truncate">{a.justificacao || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB AVALIAÇÕES */}
        <TabsContent value="avaliacoes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>Notas e avaliações das crianças</CardDescription>
              </div>
              <Dialog open={dialogAvaliacaoOpen} onOpenChange={setDialogAvaliacaoOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Avaliação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nova Avaliação</DialogTitle>
                    <DialogDescription>Registe uma nota ou avaliação</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Criança *</Label>
                      <Select value={novaAvaliacao.crianca_id} onValueChange={(v) => setNovaAvaliacao({ ...novaAvaliacao, crianca_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent>
                          {criancas.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ano Letivo *</Label>
                        <Select value={novaAvaliacao.ano_letivo} onValueChange={(v) => setNovaAvaliacao({ ...novaAvaliacao, ano_letivo: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {anosLetivos.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Período</Label>
                        <Select value={novaAvaliacao.periodo} onValueChange={(v) => setNovaAvaliacao({ ...novaAvaliacao, periodo: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {periodosAvaliacao.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Disciplina *</Label>
                        <Select value={novaAvaliacao.disciplina} onValueChange={(v) => setNovaAvaliacao({ ...novaAvaliacao, disciplina: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            {disciplinas.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Nota</Label>
                        <Input value={novaAvaliacao.nota} onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, nota: e.target.value })} placeholder="Ex: 15, Bom" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Input value={novaAvaliacao.observacoes} onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, observacoes: e.target.value })} placeholder="Observações" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogAvaliacaoOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCriarAvaliacao} disabled={!novaAvaliacao.crianca_id || !novaAvaliacao.ano_letivo || !novaAvaliacao.disciplina}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredAvaliacoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma avaliação encontrada.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criança</TableHead>
                      <TableHead>Ano Letivo</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Nota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAvaliacoes.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.crianca?.nome_completo || "-"}</TableCell>
                        <TableCell>{a.ano_letivo}</TableCell>
                        <TableCell><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">{a.disciplina}</span></TableCell>
                        <TableCell>{a.periodo || "-"}</TableCell>
                        <TableCell><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">{a.nota || "-"}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
