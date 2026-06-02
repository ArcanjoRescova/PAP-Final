"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  ClipboardList,
  Plus,
  Search,
  Stethoscope,
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
  listarRegistosSaude,
  listarAgendamentosSaude,
  listarMedicos,
  criarRegistoSaude,
  criarAgendamentoSaude,
  criarMedico,
  contarRegistosSaude,
  contarAgendamentosPendentes,
  contarMedicos,
  type SaudeRegistoComRelacoes,
  type SaudeAgendamentoComRelacoes,
} from "@/services/saudeService"
import { listarCriancas } from "@/services/criancaService"
import type { Medico, Crianca } from "@/types/database"

export default function SaudePage() {
  const [registos, setRegistos] = useState<SaudeRegistoComRelacoes[]>([])
  const [agendamentos, setAgendamentos] = useState<SaudeAgendamentoComRelacoes[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [criancas, setCriancas] = useState<Crianca[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [totalRegistos, setTotalRegistos] = useState(0)
  const [totalAgendamentos, setTotalAgendamentos] = useState(0)
  const [totalMedicos, setTotalMedicos] = useState(0)

  const [dialogRegistoOpen, setDialogRegistoOpen] = useState(false)
  const [dialogAgendamentoOpen, setDialogAgendamentoOpen] = useState(false)
  const [dialogMedicoOpen, setDialogMedicoOpen] = useState(false)

  const [novoRegisto, setNovoRegisto] = useState({
    crianca_id: "",
    tipo_registo: "",
    descricao: "",
    peso_kg: "",
    altura_cm: "",
    pressao_arterial: "",
    medico_id: "",
    observacoes: "",
  })

  const [novoAgendamento, setNovoAgendamento] = useState({
    crianca_id: "",
    tipo: "",
    descricao: "",
    data_hora: "",
    local: "",
    medico_id: "",
    observacoes: "",
  })

  const [novoMedico, setNovoMedico] = useState({
    nome: "",
    especialidade: "",
    telefone: "",
    email: "",
    credenciais: "",
    observacoes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [
        registosData,
        agendamentosData,
        medicosData,
        criancasData,
        countRegistos,
        countAgendamentos,
        countMedicos,
      ] = await Promise.all([
        listarRegistosSaude(),
        listarAgendamentosSaude(),
        listarMedicos(),
        listarCriancas(),
        contarRegistosSaude(),
        contarAgendamentosPendentes(),
        contarMedicos(),
      ])
      setRegistos(registosData)
      setAgendamentos(agendamentosData)
      setMedicos(medicosData)
      setCriancas(criancasData)
      setTotalRegistos(countRegistos)
      setTotalAgendamentos(countAgendamentos)
      setTotalMedicos(countMedicos)
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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "Agendado":
        return "bg-blue-100 text-blue-800"
      case "Realizado":
        return "bg-green-100 text-green-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      case "Faltou":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  async function handleCriarRegisto() {
    try {
      await criarRegistoSaude({
        crianca_id: novoRegisto.crianca_id,
        data_registo: new Date().toISOString(),
        tipo_registo: novoRegisto.tipo_registo || null,
        descricao: novoRegisto.descricao || null,
        peso_kg: novoRegisto.peso_kg ? parseFloat(novoRegisto.peso_kg) : null,
        altura_cm: novoRegisto.altura_cm ? parseFloat(novoRegisto.altura_cm) : null,
        pressao_arterial: novoRegisto.pressao_arterial || null,
        medico_id: novoRegisto.medico_id || null,
        observacoes: novoRegisto.observacoes || null,
      })
      setDialogRegistoOpen(false)
      setNovoRegisto({
        crianca_id: "",
        tipo_registo: "",
        descricao: "",
        peso_kg: "",
        altura_cm: "",
        pressao_arterial: "",
        medico_id: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar registo:", error)
    }
  }

  async function handleCriarAgendamento() {
    try {
      await criarAgendamentoSaude({
        crianca_id: novoAgendamento.crianca_id,
        tipo: novoAgendamento.tipo,
        descricao: novoAgendamento.descricao || null,
        data_hora: novoAgendamento.data_hora,
        local: novoAgendamento.local || null,
        medico_id: novoAgendamento.medico_id || null,
        estado: "Agendado",
        observacoes: novoAgendamento.observacoes || null,
      })
      setDialogAgendamentoOpen(false)
      setNovoAgendamento({
        crianca_id: "",
        tipo: "",
        descricao: "",
        data_hora: "",
        local: "",
        medico_id: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar agendamento:", error)
    }
  }

  async function handleCriarMedico() {
    try {
      await criarMedico({
        nome: novoMedico.nome,
        especialidade: novoMedico.especialidade || null,
        telefone: novoMedico.telefone || null,
        email: novoMedico.email || null,
        credenciais: novoMedico.credenciais || null,
        observacoes: novoMedico.observacoes || null,
      })
      setDialogMedicoOpen(false)
      setNovoMedico({
        nome: "",
        especialidade: "",
        telefone: "",
        email: "",
        credenciais: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar médico:", error)
    }
  }

  const filteredRegistos = registos.filter(
    (r) =>
      r.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tipo_registo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAgendamentos = agendamentos.filter(
    (a) =>
      a.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMedicos = medicos.filter(
    (m) =>
      m.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.especialidade?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saúde</h1>
          <p className="text-muted-foreground">
            Gestão de registos médicos, agendamentos e profissionais de saúde
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registos de Saúde</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistos}</div>
            <p className="text-xs text-muted-foreground">Total de registos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgendamentos}</div>
            <p className="text-xs text-muted-foreground">Consultas agendadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médicos Registados</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedicos}</div>
            <p className="text-xs text-muted-foreground">Profissionais de saúde</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="registos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registos" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Registos
          </TabsTrigger>
          <TabsTrigger value="agendamentos" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="medicos" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Médicos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Registos de Saúde</CardTitle>
                <CardDescription>
                  Consultas, exames e outros registos médicos
                </CardDescription>
              </div>
              <Dialog open={dialogRegistoOpen} onOpenChange={setDialogRegistoOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Registo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Novo Registo de Saúde</DialogTitle>
                    <DialogDescription>
                      Adicione um novo registo médico para uma criança
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="crianca">Criança *</Label>
                        <Select
                          value={novoRegisto.crianca_id}
                          onValueChange={(value) =>
                            setNovoRegisto({ ...novoRegisto, crianca_id: value })
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
                        <Label htmlFor="tipo">Tipo de Registo</Label>
                        <Select
                          value={novoRegisto.tipo_registo}
                          onValueChange={(value) =>
                            setNovoRegisto({ ...novoRegisto, tipo_registo: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consulta de Rotina">Consulta de Rotina</SelectItem>
                            <SelectItem value="Emergência">Emergência</SelectItem>
                            <SelectItem value="Exame">Exame</SelectItem>
                            <SelectItem value="Vacinação">Vacinação</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input
                        id="descricao"
                        value={novoRegisto.descricao}
                        onChange={(e) =>
                          setNovoRegisto({ ...novoRegisto, descricao: e.target.value })
                        }
                        placeholder="Descrição do registo"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="peso">Peso (kg)</Label>
                        <Input
                          id="peso"
                          type="number"
                          step="0.1"
                          value={novoRegisto.peso_kg}
                          onChange={(e) =>
                            setNovoRegisto({ ...novoRegisto, peso_kg: e.target.value })
                          }
                          placeholder="Ex: 35.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="altura">Altura (cm)</Label>
                        <Input
                          id="altura"
                          type="number"
                          step="0.1"
                          value={novoRegisto.altura_cm}
                          onChange={(e) =>
                            setNovoRegisto({ ...novoRegisto, altura_cm: e.target.value })
                          }
                          placeholder="Ex: 145"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pressao">Pressão Arterial</Label>
                        <Input
                          id="pressao"
                          value={novoRegisto.pressao_arterial}
                          onChange={(e) =>
                            setNovoRegisto({ ...novoRegisto, pressao_arterial: e.target.value })
                          }
                          placeholder="Ex: 120/80"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medico">Médico</Label>
                      <Select
                        value={novoRegisto.medico_id}
                        onValueChange={(value) =>
                          setNovoRegisto({ ...novoRegisto, medico_id: value })
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
                      <Label htmlFor="observacoes">Observações</Label>
                      <Input
                        id="observacoes"
                        value={novoRegisto.observacoes}
                        onChange={(e) =>
                          setNovoRegisto({ ...novoRegisto, observacoes: e.target.value })
                        }
                        placeholder="Observações adicionais"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogRegistoOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCriarRegisto}
                      disabled={!novoRegisto.crianca_id}
                    >
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  A carregar...
                </div>
              ) : filteredRegistos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum registo de saúde encontrado.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criança</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistos.map((registo) => (
                      <TableRow key={registo.id}>
                        <TableCell className="font-medium">
                          {registo.crianca?.nome_completo || "-"}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                            {registo.tipo_registo || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(registo.data_registo)}</TableCell>
                        <TableCell>{registo.medico?.nome || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {registo.descricao || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendamentos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Agendamentos</CardTitle>
                <CardDescription>
                  Consultas, exames e vacinas agendadas
                </CardDescription>
              </div>
              <Dialog open={dialogAgendamentoOpen} onOpenChange={setDialogAgendamentoOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                    <DialogDescription>
                      Agende uma consulta, exame ou vacinação
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="crianca-ag">Criança *</Label>
                        <Select
                          value={novoAgendamento.crianca_id}
                          onValueChange={(value) =>
                            setNovoAgendamento({ ...novoAgendamento, crianca_id: value })
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
                        <Label htmlFor="tipo-ag">Tipo *</Label>
                        <Select
                          value={novoAgendamento.tipo}
                          onValueChange={(value) =>
                            setNovoAgendamento({ ...novoAgendamento, tipo: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consulta">Consulta</SelectItem>
                            <SelectItem value="Exame">Exame</SelectItem>
                            <SelectItem value="Vacina">Vacina</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="data-hora">Data e Hora *</Label>
                        <Input
                          id="data-hora"
                          type="datetime-local"
                          value={novoAgendamento.data_hora}
                          onChange={(e) =>
                            setNovoAgendamento({ ...novoAgendamento, data_hora: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="local">Local</Label>
                        <Input
                          id="local"
                          value={novoAgendamento.local}
                          onChange={(e) =>
                            setNovoAgendamento({ ...novoAgendamento, local: e.target.value })
                          }
                          placeholder="Local da consulta"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao-ag">Descrição</Label>
                      <Input
                        id="descricao-ag"
                        value={novoAgendamento.descricao}
                        onChange={(e) =>
                          setNovoAgendamento({ ...novoAgendamento, descricao: e.target.value })
                        }
                        placeholder="Descrição do agendamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medico-ag">Médico</Label>
                      <Select
                        value={novoAgendamento.medico_id}
                        onValueChange={(value) =>
                          setNovoAgendamento({ ...novoAgendamento, medico_id: value })
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
                      <Label htmlFor="observacoes-ag">Observações</Label>
                      <Input
                        id="observacoes-ag"
                        value={novoAgendamento.observacoes}
                        onChange={(e) =>
                          setNovoAgendamento({ ...novoAgendamento, observacoes: e.target.value })
                        }
                        placeholder="Observações adicionais"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogAgendamentoOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCriarAgendamento}
                      disabled={
                        !novoAgendamento.crianca_id ||
                        !novoAgendamento.tipo ||
                        !novoAgendamento.data_hora
                      }
                    >
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  A carregar...
                </div>
              ) : filteredAgendamentos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento encontrado.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criança</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgendamentos.map((agendamento) => (
                      <TableRow key={agendamento.id}>
                        <TableCell className="font-medium">
                          {agendamento.crianca?.nome_completo || "-"}
                        </TableCell>
                        <TableCell>{agendamento.tipo}</TableCell>
                        <TableCell>{formatDateTime(agendamento.data_hora)}</TableCell>
                        <TableCell>{agendamento.local || "-"}</TableCell>
                        <TableCell>{agendamento.medico?.nome || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeClass(
                              agendamento.estado
                            )}`}
                          >
                            {agendamento.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Médicos</CardTitle>
                <CardDescription>
                  Profissionais de saúde registados no sistema
                </CardDescription>
              </div>
              <Dialog open={dialogMedicoOpen} onOpenChange={setDialogMedicoOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Médico
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Novo Médico</DialogTitle>
                    <DialogDescription>
                      Adicione um novo profissional de saúde
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-med">Nome *</Label>
                      <Input
                        id="nome-med"
                        value={novoMedico.nome}
                        onChange={(e) =>
                          setNovoMedico({ ...novoMedico, nome: e.target.value })
                        }
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="especialidade">Especialidade</Label>
                        <Input
                          id="especialidade"
                          value={novoMedico.especialidade}
                          onChange={(e) =>
                            setNovoMedico({ ...novoMedico, especialidade: e.target.value })
                          }
                          placeholder="Ex: Pediatria"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credenciais">Credenciais</Label>
                        <Input
                          id="credenciais"
                          value={novoMedico.credenciais}
                          onChange={(e) =>
                            setNovoMedico({ ...novoMedico, credenciais: e.target.value })
                          }
                          placeholder="Nº Ordem"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone-med">Telefone</Label>
                        <Input
                          id="telefone-med"
                          value={novoMedico.telefone}
                          onChange={(e) =>
                            setNovoMedico({ ...novoMedico, telefone: e.target.value })
                          }
                          placeholder="912345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-med">Email</Label>
                        <Input
                          id="email-med"
                          type="email"
                          value={novoMedico.email}
                          onChange={(e) =>
                            setNovoMedico({ ...novoMedico, email: e.target.value })
                          }
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="observacoes-med">Observações</Label>
                      <Input
                        id="observacoes-med"
                        value={novoMedico.observacoes}
                        onChange={(e) =>
                          setNovoMedico({ ...novoMedico, observacoes: e.target.value })
                        }
                        placeholder="Observações adicionais"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogMedicoOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCriarMedico}
                      disabled={!novoMedico.nome}
                    >
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  A carregar...
                </div>
              ) : filteredMedicos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum médico registado.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Credenciais</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicos.map((medico) => (
                      <TableRow key={medico.id}>
                        <TableCell className="font-medium">{medico.nome}</TableCell>
                        <TableCell>{medico.especialidade || "-"}</TableCell>
                        <TableCell>{medico.telefone || "-"}</TableCell>
                        <TableCell>{medico.email || "-"}</TableCell>
                        <TableCell>{medico.credenciais || "-"}</TableCell>
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
