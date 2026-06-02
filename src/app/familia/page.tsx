"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  Link2,
  Plus,
  Search,
  Users,
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
  listarFamilias,
  listarVinculos,
  listarVisitas,
  criarFamilia,
  criarVinculos,
  criarVisita,
  contarFamilias,
  contarVinculos,
  contarVisitasAgendadas,
  type VinculoComRelacoes,
  type VisitaComRelacoes,
} from "@/services/familiaService"
import { listarCriancas } from "@/services/criancaService"
import type { Familia, Crianca } from "@/types/database"

export default function FamiliaPage() {
  const [familias, setFamilias] = useState<Familia[]>([])
  const [vinculos, setVinculos] = useState<VinculoComRelacoes[]>([])
  const [visitas, setVisitas] = useState<VisitaComRelacoes[]>([])
  const [criancas, setCriancas] = useState<Crianca[]>([])
  const criancasOrdenadas = useMemo(
    () =>
      // Mantém a lista em ordem alfabética para facilitar seleção no formulário.
      [...criancas].sort((a, b) =>
        (a.nome_completo || "").localeCompare(b.nome_completo || "", "pt", {
          sensitivity: "base",
        })
      ),
    [criancas]
  )
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [totalFamilias, setTotalFamilias] = useState(0)
  const [totalVinculos, setTotalVinculos] = useState(0)
  const [totalVisitasAgendadas, setTotalVisitasAgendadas] = useState(0)

  const [dialogFamiliaOpen, setDialogFamiliaOpen] = useState(false)
  const [dialogVisitaOpen, setDialogVisitaOpen] = useState(false)

  const [novaFamilia, setNovaFamilia] = useState({
    nome_responsavel: "",
    telefone: "",
    email: "",
    morada: "",
    localizacao: "",
    observacoes: "",
    crianca_ids: [] as string[],
    parentesco: "",
  })

  const [novaVisita, setNovaVisita] = useState({
    crianca_id: "",
    familia_id: "",
    data_prevista: "",
    local: "",
    tipo: "",
    observacoes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      // Carrega todos os dados da página em paralelo para reduzir tempo de espera.
      const [
        familiasData,
        vinculosData,
        visitasData,
        criancasData,
        countFamilias,
        countVinculos,
        countVisitas,
      ] = await Promise.all([
        listarFamilias(),
        listarVinculos(),
        listarVisitas(),
        listarCriancas(),
        contarFamilias(),
        contarVinculos(),
        contarVisitasAgendadas(),
      ])
      setFamilias(familiasData)
      setVinculos(vinculosData)
      setVisitas(visitasData)
      setCriancas(criancasData)
      setTotalFamilias(countFamilias)
      setTotalVinculos(countVinculos)
      setTotalVisitasAgendadas(countVisitas)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
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

  async function handleCriarFamilia() {
    try {
      // 1) Cria o registo da família (responsável).
      const familiaCriada = await criarFamilia({
        nome_responsavel: novaFamilia.nome_responsavel,
        telefone: novaFamilia.telefone || null,
        email: novaFamilia.email || null,
        morada: novaFamilia.morada || null,
        localizacao: novaFamilia.localizacao || null,
        observacoes: novaFamilia.observacoes || null,
      })

      // 2) Cria um vínculo para cada criança selecionada.
      const vinculosPayload = novaFamilia.crianca_ids.map((crianca_id) => ({
        crianca_id,
        familia_id: familiaCriada.id,
        parentesco: novaFamilia.parentesco || null,
        e_tutor_legal: false,
        observacoes: null as string | null,
      }))
      await criarVinculos(vinculosPayload)

      setDialogFamiliaOpen(false)
      setNovaFamilia({
        nome_responsavel: "",
        telefone: "",
        email: "",
        morada: "",
        localizacao: "",
        observacoes: "",
        crianca_ids: [],
        parentesco: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar família:", error)
    }
  }

  async function handleCriarVisita() {
    try {
      await criarVisita({
        crianca_id: novaVisita.crianca_id,
        familia_id: novaVisita.familia_id,
        data_prevista: novaVisita.data_prevista || null,
        data_realizada: null,
        local: novaVisita.local || null,
        tipo: novaVisita.tipo || null,
        observacoes: novaVisita.observacoes || null,
      })
      setDialogVisitaOpen(false)
      setNovaVisita({
        crianca_id: "",
        familia_id: "",
        data_prevista: "",
        local: "",
        tipo: "",
        observacoes: "",
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar visita:", error)
    }
  }

  const filteredFamilias = familias.filter(
    (f) =>
      f.nome_responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.morada?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredVisitas = visitas.filter(
    (v) =>
      v.crianca?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.familia?.nome_responsavel?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const criancasPorFamilia = vinculos.reduce<Record<string, string[]>>((acc, vinculo) => {
    if (!vinculo.familia_id || !vinculo.crianca?.nome_completo) return acc

    if (!acc[vinculo.familia_id]) {
      acc[vinculo.familia_id] = []
    }

    if (!acc[vinculo.familia_id].includes(vinculo.crianca.nome_completo)) {
      acc[vinculo.familia_id].push(vinculo.crianca.nome_completo)
    }

    return acc
  }, {})

  const parentescos = [
    "Mãe",
    "Pai",
    "Avó",
    "Avô",
    "Tia",
    "Tio",
    "Irmã",
    "Irmão",
    "Madrinha",
    "Padrinho",
    "Tutor Legal",
    "Outro",
  ]

  const tiposVisita = [
    "Visita Normal",
    "Visita Supervisionada",
    "Reunião",
    "Saída Temporária",
    "Outro",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Família</h1>
          <p className="text-muted-foreground">
            Gestão de famílias, vínculos e visitas
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Famílias</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFamilias}</div>
            <p className="text-xs text-muted-foreground">Famílias registadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vínculos Familiares</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVinculos}</div>
            <p className="text-xs text-muted-foreground">Ligações criança-família</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitasAgendadas}</div>
            <p className="text-xs text-muted-foreground">Próximas visitas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, parentesco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="familias" className="space-y-4">
        <TabsList>
          <TabsTrigger value="familias" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Famílias
          </TabsTrigger>
          <TabsTrigger value="visitas" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Visitas
          </TabsTrigger>
        </TabsList>

        {/* TAB FAMÍLIAS */}
        <TabsContent value="familias">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Famílias</CardTitle>
                <CardDescription>Responsáveis e familiares das crianças</CardDescription>
              </div>
              <Dialog open={dialogFamiliaOpen} onOpenChange={setDialogFamiliaOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Família
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nova Família</DialogTitle>
                    <DialogDescription>
                      Adicione um responsável ou familiar e vincule-o a uma ou várias crianças
                      (por exemplo, irmãos com o mesmo tutor).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nome do Responsável *</Label>
                      <Input
                        value={novaFamilia.nome_responsavel}
                        onChange={(e) =>
                          setNovaFamilia({ ...novaFamilia, nome_responsavel: e.target.value })
                        }
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={novaFamilia.telefone}
                          onChange={(e) =>
                            setNovaFamilia({ ...novaFamilia, telefone: e.target.value })
                          }
                          placeholder="912345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={novaFamilia.email}
                          onChange={(e) =>
                            setNovaFamilia({ ...novaFamilia, email: e.target.value })
                          }
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Morada</Label>
                      <Input
                        value={novaFamilia.morada}
                        onChange={(e) =>
                          setNovaFamilia({ ...novaFamilia, morada: e.target.value })
                        }
                        placeholder="Morada completa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Localização/Região</Label>
                      <Input
                        value={novaFamilia.localizacao}
                        onChange={(e) =>
                          setNovaFamilia({ ...novaFamilia, localizacao: e.target.value })
                        }
                        placeholder="Cidade ou região"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Input
                        value={novaFamilia.observacoes}
                        onChange={(e) =>
                          setNovaFamilia({ ...novaFamilia, observacoes: e.target.value })
                        }
                        placeholder="Observações adicionais"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Crianças a vincular *</Label>
                      <p className="text-xs text-muted-foreground">
                        Selecione todas as crianças com o mesmo parentesco neste registo.
                      </p>
                      {criancasOrdenadas.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Não há crianças registadas. Crie uma criança primeiro.
                        </p>
                      ) : (
                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                          {criancasOrdenadas.map((c) => {
                            const checked = novaFamilia.crianca_ids.includes(c.id)
                            return (
                              <div key={c.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`crianca-fam-${c.id}`}
                                  checked={checked}
                                  onChange={() => {
                                    setNovaFamilia((prev) => ({
                                      ...prev,
                                      crianca_ids: checked
                                        ? prev.crianca_ids.filter((id) => id !== c.id)
                                        : [...prev.crianca_ids, c.id],
                                    }))
                                  }}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label
                                  htmlFor={`crianca-fam-${c.id}`}
                                  className="cursor-pointer font-normal leading-none"
                                >
                                  {c.nome_completo}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      )}
                      {novaFamilia.crianca_ids.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {novaFamilia.crianca_ids.length} criança
                          {novaFamilia.crianca_ids.length !== 1 ? "s" : ""} selecionada
                          {novaFamilia.crianca_ids.length !== 1 ? "s" : ""}.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Parentesco</Label>
                      <Select
                        value={novaFamilia.parentesco}
                        onValueChange={(value) =>
                          setNovaFamilia({ ...novaFamilia, parentesco: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar parentesco" />
                        </SelectTrigger>
                        <SelectContent>
                          {parentescos.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogFamiliaOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCriarFamilia}
                      disabled={
                        !novaFamilia.nome_responsavel ||
                        novaFamilia.crianca_ids.length === 0
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
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredFamilias.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma família encontrada.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Criança Vinculada</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Morada</TableHead>
                      <TableHead>Localização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFamilias.map((familia) => (
                      <TableRow key={familia.id}>
                        <TableCell className="font-medium">
                          {familia.nome_responsavel}
                        </TableCell>
                        <TableCell>
                          {criancasPorFamilia[familia.id]?.join(", ") || "-"}
                        </TableCell>
                        <TableCell>{familia.telefone || "-"}</TableCell>
                        <TableCell>{familia.email || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {familia.morada || "-"}
                        </TableCell>
                        <TableCell>{familia.localizacao || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB VISITAS */}
        <TabsContent value="visitas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Visitas</CardTitle>
                <CardDescription>Visitas agendadas e realizadas</CardDescription>
              </div>
              <Dialog open={dialogVisitaOpen} onOpenChange={setDialogVisitaOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Agendar Visita
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Agendar Visita</DialogTitle>
                    <DialogDescription>
                      Agende uma visita de um familiar a uma criança
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Criança *</Label>
                      <Select
                        value={novaVisita.crianca_id}
                        onValueChange={(value) =>
                          setNovaVisita({ ...novaVisita, crianca_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar criança" />
                        </SelectTrigger>
                        <SelectContent>
                          {criancasOrdenadas.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.nome_completo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Família *</Label>
                      <Select
                        value={novaVisita.familia_id}
                        onValueChange={(value) =>
                          setNovaVisita({ ...novaVisita, familia_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar família" />
                        </SelectTrigger>
                        <SelectContent>
                          {familias.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.nome_responsavel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data e Hora Prevista *</Label>
                      <Input
                        type="datetime-local"
                        value={novaVisita.data_prevista}
                        onChange={(e) =>
                          setNovaVisita({ ...novaVisita, data_prevista: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Visita</Label>
                        <Select
                          value={novaVisita.tipo}
                          onValueChange={(value) =>
                            setNovaVisita({ ...novaVisita, tipo: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposVisita.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Local</Label>
                        <Input
                          value={novaVisita.local}
                          onChange={(e) =>
                            setNovaVisita({ ...novaVisita, local: e.target.value })
                          }
                          placeholder="Ex: Lar, Exterior"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Input
                        value={novaVisita.observacoes}
                        onChange={(e) =>
                          setNovaVisita({ ...novaVisita, observacoes: e.target.value })
                        }
                        placeholder="Observações adicionais"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogVisitaOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCriarVisita}
                      disabled={
                        !novaVisita.crianca_id ||
                        !novaVisita.familia_id ||
                        !novaVisita.data_prevista
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
                <div className="text-center py-8 text-muted-foreground">A carregar...</div>
              ) : filteredVisitas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma visita encontrada.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criança</TableHead>
                      <TableHead>Familiar</TableHead>
                      <TableHead>Data Prevista</TableHead>
                      <TableHead>Data Realizada</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Local</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisitas.map((visita) => (
                      <TableRow key={visita.id}>
                        <TableCell className="font-medium">
                          {visita.crianca?.nome_completo || "-"}
                        </TableCell>
                        <TableCell>{visita.familia?.nome_responsavel || "-"}</TableCell>
                        <TableCell>{formatDateTime(visita.data_prevista)}</TableCell>
                        <TableCell>
                          {visita.data_realizada ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                              {formatDateTime(visita.data_realizada)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                              Pendente
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{visita.tipo || "-"}</TableCell>
                        <TableCell>{visita.local || "-"}</TableCell>
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
