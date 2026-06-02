"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Bell, LogOut, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { listarVisitasAgendadas } from "@/services/familiaService"
import { listarAgendamentosFuturos } from "@/services/saudeService"

type NotificationItem = {
  id: string
  tipo: "visita" | "saude"
  titulo: string
  descricao: string
  dataEvento: string
  isAviso1Dia: boolean
}

export function Topbar() {
  const { user, logout } = useAuth()
  const [notificacoesOpen, setNotificacoesOpen] = useState(false)
  const [notificacoes, setNotificacoes] = useState<NotificationItem[]>([])
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false)
  const notificacoesRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      await logout()
    }
  }

  useEffect(() => {
    carregarNotificacoes()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificacoesRef.current && !notificacoesRef.current.contains(event.target as Node)) {
        setNotificacoesOpen(false)
      }
    }

    if (notificacoesOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notificacoesOpen])

  const totalAvisos1Dia = useMemo(
    () => notificacoes.filter((item) => item.isAviso1Dia).length,
    [notificacoes]
  )

  const totalPendentes = notificacoes.length

  const formatarDataHora = (dataIso: string) =>
    new Date(dataIso).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  async function carregarNotificacoes() {
    try {
      setLoadingNotificacoes(true)
      const [visitasAgendadas, agendamentosSaude] = await Promise.all([
        listarVisitasAgendadas(),
        listarAgendamentosFuturos(),
      ])

      const agora = new Date()
      const limiteAviso = new Date(agora.getTime() + 24 * 60 * 60 * 1000)

      const notificacoesVisitas: NotificationItem[] = visitasAgendadas
        .filter((visita) => !!visita.data_prevista)
        .map((visita) => {
          const dataEvento = visita.data_prevista as string
          const dataEventoDate = new Date(dataEvento)
          return {
            id: `visita-${visita.id}`,
            tipo: "visita",
            titulo: "Visita pendente",
            descricao: `${visita.crianca?.nome_completo || "Criança"} com ${visita.familia?.nome_responsavel || "familiar"}`,
            dataEvento,
            isAviso1Dia: dataEventoDate >= agora && dataEventoDate <= limiteAviso,
          }
        })

      const notificacoesSaude: NotificationItem[] = agendamentosSaude
        .filter((agendamento) => !!agendamento.data_hora)
        .map((agendamento) => {
          const dataEvento = agendamento.data_hora
          const dataEventoDate = new Date(dataEvento)
          return {
            id: `saude-${agendamento.id}`,
            tipo: "saude",
            titulo: "Consulta/Agendamento pendente",
            descricao: `${agendamento.crianca?.nome_completo || "Criança"} - ${agendamento.tipo}`,
            dataEvento,
            isAviso1Dia: dataEventoDate >= agora && dataEventoDate <= limiteAviso,
          }
        })

      const todas = [...notificacoesVisitas, ...notificacoesSaude].sort(
        (a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime()
      )

      setNotificacoes(todas)
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
      setNotificacoes([])
    } finally {
      setLoadingNotificacoes(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Pesquisar..." className="pl-9 w-full" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={notificacoesRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              type="button"
              onClick={() => {
                setNotificacoesOpen((prev) => !prev)
                if (!notificacoesOpen) {
                  carregarNotificacoes()
                }
              }}
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
              {totalPendentes > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>

            {notificacoesOpen && (
              <div className="absolute right-0 mt-2 w-[380px] rounded-lg border bg-white shadow-lg z-50">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold">Notificações</p>
                  <p className="text-xs text-muted-foreground">
                    {totalPendentes} pendentes • {totalAvisos1Dia} com aviso de 1 dia
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto p-2">
                  {loadingNotificacoes ? (
                    <p className="px-2 py-4 text-sm text-muted-foreground">A carregar notificações...</p>
                  ) : notificacoes.length === 0 ? (
                    <p className="px-2 py-4 text-sm text-muted-foreground">
                      Sem eventos pendentes de momento.
                    </p>
                  ) : (
                    notificacoes.map((item) => (
                      <div key={item.id} className="mb-2 rounded-md border p-3 last:mb-0">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{item.titulo}</p>
                          {item.isAviso1Dia && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                              Aviso 1 dia
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.descricao}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {item.tipo === "visita" ? "Visita" : "Saúde"} • {formatarDataHora(item.dataEvento)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-muted-foreground">
                {user?.email || "admin@larsantoantonio.pt"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
