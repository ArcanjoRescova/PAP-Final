"use client"

import { useEffect, useState } from "react"
import { Clock, Pill, Plus, Search, User } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  listarMedicacoes,
  criarMedicacao,
  contarMedicacoes,
  contarMedicacoesAtivas,
  type MedicacaoComRelacoes,
} from "@/services/medicacaoService"
import { listarMedicos } from "@/services/saudeService"
import { listarCriancas } from "@/services/criancaService"
import type { Medico, Crianca } from "@/types/database"

export default function MedicacaoPage() {
  const [medicacoes, setMedicacoes] = useState<MedicacaoComRelacoes[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [criancas, setCriancas] = useState<Crianca[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [totalMedicacoes, setTotalMedicacoes] = useState(0)
  const [totalAtivas, setTotalAtivas] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false)

  const [novaMedicacao, setNovaMedicacao] = useState({
    crianca_id: "",
    nome_medicacao: "",
    dosagem: "",
    frequencia: "",
    via_administracao: "",
    data_inicio: "",
    data_fim: "",
    prescrito_por_medico_id: "",
    observacoes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [medicacoesData, medicosData, criancasData, countTotal, countAtivas] =
        await Promise.all([
          listarMedicacoes(),
          listarMedicos(),
          listarCriancas(),
          contarMedicacoes(),
          contarMedicacoesAtivas(),
        ])
      setMedicacoes(medicacoesData)
      setMedicos(medicosData)
      setCriancas(criancasData)
      setTotalMedicacoes(countTotal)
      setTotalAtivas(countAtivas)
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

  const isAtiva = (dataFim: string | null) => {
    if (!dataFim) return true
    return new Date(dataFim) >= new Date()
  }

  async function handleCriarMedicacao() {
    try {
      await criarMedicacao({
        crianca_id: novaMedicacao.crianca_id,
        nome_medicacao: novaMedicacao.nome_medicacao,
        dosagem: novaMedicacao.dosagem || null,
        frequencia: novaMedicacao.frequencia || null,
        via_administracao: novaMedicacao.via_administracao || null,
        data_inicio: novaMedicacao.data_inicio || null,
        data_fim: novaMedicacao.data_fim || null,
        prescrito_por_medico_id: novaMedicacao.prescrito_por_medico_id || null,
        observacoes: novaMedicacao.observacoes || null,
      })
      setDialogOpen(false)
      setNovaMedicacao({
        crianca_id: "",
        nome_medicacao: "",
        dosagem: "",
        frequencia: "",
        via_administracao: "",
        data_inicio: "",
        data_fim: "",
        prescrito_por_medico_id: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar medicação:", error)
    }
  }

  const filteredMedicacoes = medicacoes.filter(
    (m) =>
      m.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nome_medicacao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medicação</h1>
          <p className="text-muted-foreground">
            Gestão de medicação prescrita às crianças
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Medicação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Medicação</DialogTitle>
              <DialogDescription>
                Adicione uma nova medicação para uma criança
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Criança *</Label>
                  <Select
                    value={novaMedicacao.crianca_id}
                    onValueChange={(value) =>
                      setNovaMedicacao({ ...novaMedicacao, crianca_id: value })
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
                  <Label>Medicamento *</Label>
                  <Input
                    value={novaMedicacao.nome_medicacao}
                    onChange={(e) =>
                      setNovaMedicacao({ ...novaMedicacao, nome_medicacao: e.target.value })
                    }
                    placeholder="Nome do medicamento"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Dosagem</Label>
                  <Input
                    value={novaMedicacao.dosagem}
                    onChange={(e) =>
                      setNovaMedicacao({ ...novaMedicacao, dosagem: e.target.value })
                    }
                    placeholder="Ex: 5ml, 1 comp"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Input
                    value={novaMedicacao.frequencia}
                    onChange={(e) =>
                      setNovaMedicacao({ ...novaMedicacao, frequencia: e.target.value })
                    }
                    placeholder="Ex: 2x ao dia"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Via de Administração</Label>
                  <Select
                    value={novaMedicacao.via_administracao}
                    onValueChange={(value) =>
                      setNovaMedicacao({ ...novaMedicacao, via_administracao: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oral">Oral</SelectItem>
                      <SelectItem value="Injetável">Injetável</SelectItem>
                      <SelectItem value="Tópica">Tópica</SelectItem>
                      <SelectItem value="Inalatória">Inalatória</SelectItem>
                      <SelectItem value="Outra">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={novaMedicacao.data_inicio}
                    onChange={(e) =>
                      setNovaMedicacao({ ...novaMedicacao, data_inicio: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  <Input
                    type="date"
                    value={novaMedicacao.data_fim}
                    onChange={(e) =>
                      setNovaMedicacao({ ...novaMedicacao, data_fim: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prescrito por</Label>
                <Select
                  value={novaMedicacao.prescrito_por_medico_id}
                  onValueChange={(value) =>
                    setNovaMedicacao({ ...novaMedicacao, prescrito_por_medico_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar médico (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicos.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nome} {m.especialidade ? `(${m.especialidade})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Input
                  value={novaMedicacao.observacoes}
                  onChange={(e) =>
                    setNovaMedicacao({ ...novaMedicacao, observacoes: e.target.value })
                  }
                  placeholder="Observações adicionais"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCriarMedicacao}
                disabled={!novaMedicacao.crianca_id || !novaMedicacao.nome_medicacao}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Medicações</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedicacoes}</div>
            <p className="text-xs text-muted-foreground">Medicações registadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicações Ativas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtivas}</div>
            <p className="text-xs text-muted-foreground">Em curso atualmente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crianças com Medicação</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(medicacoes.map((m) => m.crianca_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Com medicação prescrita</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por criança ou medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Medicações</CardTitle>
          <CardDescription>Todas as medicações prescritas às crianças</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">A carregar...</div>
          ) : filteredMedicacoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma medicação encontrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criança</TableHead>
                  <TableHead>Medicamento</TableHead>
                  <TableHead>Dosagem</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicacoes.map((medicacao) => (
                  <TableRow key={medicacao.id}>
                    <TableCell className="font-medium">
                      {medicacao.crianca?.nome_completo || "-"}
                    </TableCell>
                    <TableCell>{medicacao.nome_medicacao}</TableCell>
                    <TableCell>{medicacao.dosagem || "-"}</TableCell>
                    <TableCell>{medicacao.frequencia || "-"}</TableCell>
                    <TableCell>
                      {formatDate(medicacao.data_inicio)} - {formatDate(medicacao.data_fim)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                          isAtiva(medicacao.data_fim)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isAtiva(medicacao.data_fim) ? "Ativa" : "Terminada"}
                      </span>
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
