"use client"

import { useEffect, useState } from "react"
import { Activity, Plus, Search, Trophy, Users } from "lucide-react"

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
  listarAtividades,
  listarParticipacoes,
  criarAtividade,
  criarParticipacao,
  contarAtividades,
  contarParticipacoes,
  type ParticipacaoComRelacoes,
} from "@/services/atividadeService"
import { listarCriancas } from "@/services/criancaService"
import type { Atividade, Crianca } from "@/types/database"

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [participacoes, setParticipacoes] = useState<ParticipacaoComRelacoes[]>([])
  const [criancas, setCriancas] = useState<Crianca[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [totalAtividades, setTotalAtividades] = useState(0)
  const [totalParticipacoes, setTotalParticipacoes] = useState(0)

  const [dialogAtividadeOpen, setDialogAtividadeOpen] = useState(false)
  const [dialogParticipacaoOpen, setDialogParticipacaoOpen] = useState(false)

  const [novaAtividade, setNovaAtividade] = useState({
    nome: "",
    descricao: "",
  })

  const [novaParticipacao, setNovaParticipacao] = useState({
    crianca_id: "",
    atividade_id: "",
    ano_letivo: "",
    local: "",
    data_inicio: "",
    data_fim: "",
    motivo: "",
    professor_responsavel: "",
    observacoes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [atividadesData, participacoesData, criancasData, countAtividades, countParticipacoes] =
        await Promise.all([
          listarAtividades(),
          listarParticipacoes(),
          listarCriancas(),
          contarAtividades(),
          contarParticipacoes(),
        ])
      setAtividades(atividadesData)
      setParticipacoes(participacoesData)
      setCriancas(criancasData)
      setTotalAtividades(countAtividades)
      setTotalParticipacoes(countParticipacoes)
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

  async function handleCriarAtividade() {
    try {
      await criarAtividade({
        nome: novaAtividade.nome,
        descricao: novaAtividade.descricao || null,
      })
      setDialogAtividadeOpen(false)
      setNovaAtividade({
        nome: "",
        descricao: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar atividade:", error)
    }
  }

  async function handleCriarParticipacao() {
    try {
      await criarParticipacao({
        crianca_id: novaParticipacao.crianca_id,
        atividade_id: novaParticipacao.atividade_id,
        ano_letivo: novaParticipacao.ano_letivo || null,
        local: novaParticipacao.local || null,
        data_inicio: novaParticipacao.data_inicio || null,
        data_fim: novaParticipacao.data_fim || null,
        motivo: novaParticipacao.motivo || null,
        professor_responsavel: novaParticipacao.professor_responsavel || null,
        observacoes: novaParticipacao.observacoes || null,
      })
      setDialogParticipacaoOpen(false)
      setNovaParticipacao({
        crianca_id: "",
        atividade_id: "",
        ano_letivo: "",
        local: "",
        data_inicio: "",
        data_fim: "",
        motivo: "",
        professor_responsavel: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar participação:", error)
    }
  }

  const filteredAtividades = atividades.filter(
    (a) =>
      a.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredParticipacoes = participacoes.filter(
    (p) =>
      p.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.atividade?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentYear = new Date().getFullYear()
  const anosLetivos = [
    `${currentYear}/${currentYear + 1}`,
    `${currentYear - 1}/${currentYear}`,
    `${currentYear - 2}/${currentYear - 1}`,
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
          <p className="text-muted-foreground">
            Gestão de atividades extracurriculares das crianças
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atividades</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtividades}</div>
            <p className="text-xs text-muted-foreground">Atividades disponíveis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Participações</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipacoes}</div>
            <p className="text-xs text-muted-foreground">Inscrições registadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crianças Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(participacoes.map((p) => p.crianca_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Com atividades</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por atividade ou criança..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="atividades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="atividades" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Atividades
          </TabsTrigger>
          <TabsTrigger value="participacoes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="atividades">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Atividades Extracurriculares</CardTitle>
                <CardDescription>Lista de atividades disponíveis</CardDescription>
              </div>
              <Dialog open={dialogAtividadeOpen} onOpenChange={setDialogAtividadeOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Atividade
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nova Atividade</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova atividade extracurricular
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input
                        value={novaAtividade.nome}
                        onChange={(e) =>
                          setNovaAtividade({ ...novaAtividade, nome: e.target.value })
                        }
                        placeholder="Ex: Futebol, Música, Natação"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Input
                        value={novaAtividade.descricao}
                        onChange={(e) =>
                          setNovaAtividade({ ...novaAtividade, descricao: e.target.value })
                        }
                        placeholder="Descrição da atividade"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogAtividadeOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCriarAtividade} disabled={!novaAtividade.nome}>
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredAtividades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma atividade encontrada.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Participantes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAtividades.map((atividade) => {
                      const numParticipantes = participacoes.filter(
                        (p) => p.atividade_id === atividade.id
                      ).length
                      return (
                        <TableRow key={atividade.id}>
                          <TableCell className="font-medium">{atividade.nome}</TableCell>
                          <TableCell>{atividade.descricao || "-"}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                              {numParticipantes} criança(s)
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participacoes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Participações</CardTitle>
                <CardDescription>
                  Inscrições das crianças nas atividades extracurriculares
                </CardDescription>
              </div>
              <Dialog open={dialogParticipacaoOpen} onOpenChange={setDialogParticipacaoOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Participação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Nova Participação</DialogTitle>
                    <DialogDescription>
                      Inscreva uma criança numa atividade extracurricular
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Criança *</Label>
                        <Select
                          value={novaParticipacao.crianca_id}
                          onValueChange={(value) =>
                            setNovaParticipacao({ ...novaParticipacao, crianca_id: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar criança" />
                          </SelectTrigger>
                          <SelectContent>
                            {criancas.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.nome_completo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Atividade *</Label>
                        <Select
                          value={novaParticipacao.atividade_id}
                          onValueChange={(value) =>
                            setNovaParticipacao({ ...novaParticipacao, atividade_id: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar atividade" />
                          </SelectTrigger>
                          <SelectContent>
                            {atividades.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ano Letivo</Label>
                        <Select
                          value={novaParticipacao.ano_letivo}
                          onValueChange={(value) =>
                            setNovaParticipacao({ ...novaParticipacao, ano_letivo: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar ano" />
                          </SelectTrigger>
                          <SelectContent>
                            {anosLetivos.map((ano) => (
                              <SelectItem key={ano} value={ano}>
                                {ano}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Local</Label>
                        <Input
                          value={novaParticipacao.local}
                          onChange={(e) =>
                            setNovaParticipacao({ ...novaParticipacao, local: e.target.value })
                          }
                          placeholder="Local da atividade"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Início</Label>
                        <Input
                          type="date"
                          value={novaParticipacao.data_inicio}
                          onChange={(e) =>
                            setNovaParticipacao({ ...novaParticipacao, data_inicio: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de Fim</Label>
                        <Input
                          type="date"
                          value={novaParticipacao.data_fim}
                          onChange={(e) =>
                            setNovaParticipacao({ ...novaParticipacao, data_fim: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Professor/Responsável</Label>
                      <Input
                        value={novaParticipacao.professor_responsavel}
                        onChange={(e) =>
                          setNovaParticipacao({
                            ...novaParticipacao,
                            professor_responsavel: e.target.value,
                          })
                        }
                        placeholder="Nome do professor ou responsável"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo/Objetivo</Label>
                      <Input
                        value={novaParticipacao.motivo}
                        onChange={(e) =>
                          setNovaParticipacao({ ...novaParticipacao, motivo: e.target.value })
                        }
                        placeholder="Porquê esta atividade?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Input
                        value={novaParticipacao.observacoes}
                        onChange={(e) =>
                          setNovaParticipacao({ ...novaParticipacao, observacoes: e.target.value })
                        }
                        placeholder="Observações adicionais"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogParticipacaoOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCriarParticipacao}
                      disabled={!novaParticipacao.crianca_id || !novaParticipacao.atividade_id}
                    >
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredParticipacoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma participação encontrada.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criança</TableHead>
                      <TableHead>Atividade</TableHead>
                      <TableHead>Ano Letivo</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Responsável</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipacoes.map((participacao) => (
                      <TableRow key={participacao.id}>
                        <TableCell className="font-medium">
                          {participacao.crianca?.nome_completo || "-"}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                            {participacao.atividade?.nome || "-"}
                          </span>
                        </TableCell>
                        <TableCell>{participacao.ano_letivo || "-"}</TableCell>
                        <TableCell>{participacao.local || "-"}</TableCell>
                        <TableCell>
                          {formatDate(participacao.data_inicio)} -{" "}
                          {formatDate(participacao.data_fim)}
                        </TableCell>
                        <TableCell>{participacao.professor_responsavel || "-"}</TableCell>
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
