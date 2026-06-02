"use client"

import { useEffect, useState, useRef, type ChangeEvent } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Camera, Edit, Trash2, User, CreditCard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { obterCrianca, removerCrianca, atualizarCrianca } from "@/services/criancaService"
import { uploadFotoCrianca } from "@/services/storageService"
import { Crianca } from "@/types/database"

export default function CriancaDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [crianca, setCrianca] = useState<Crianca | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await obterCrianca(params.id as string)
        setCrianca(data)
      } catch (error) {
        console.error("Erro ao carregar criança:", error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja remover esta criança?")) return

    try {
      await removerCrianca(params.id as string)
      router.push("/criancas")
    } catch (error) {
      console.error("Erro ao remover criança:", error)
      alert("Erro ao remover criança. Por favor, tente novamente.")
    }
  }

  const handleFotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !crianca) return

    setUploading(true)
    try {
      const fotoUrl = await uploadFotoCrianca(crianca.id, file)
      await atualizarCrianca(crianca.id, { foto_url: fotoUrl })
      setCrianca({ ...crianca, foto_url: fotoUrl })
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error)
      alert("Erro ao fazer upload da foto. Por favor, tente novamente.")
    } finally {
      setUploading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const m = hoje.getMonth() - nascimento.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  const getPrimeiroNome = (nome: string) => {
    return nome.split(" ")[0]
  }

  const getApelidos = (nome: string) => {
    const partes = nome.split(" ")
    return partes.slice(1).join(" ") || ""
  }

  if (loading) {
    return <div className="text-center py-8">A carregar...</div>
  }

  if (!crianca) {
    return <div className="text-center py-8">Criança não encontrada.</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/criancas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {crianca.nome_completo}
            </h1>
            <p className="text-muted-foreground">Cartão de Identificação</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/criancas/${crianca.id}/editar`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </Button>
        </div>
      </div>

      {/* Cartão de Identificação - Estilo Cartão de Cidadão */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Frente do Cartão */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Barra superior com cores nacionais */}
            <div className="h-2 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600"></div>
            
            {/* Header do cartão */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Lar Santo António"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                  <div>
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest">
                      Lar Santo António da Cidade de Santarém
                    </p>
                    <p className="text-sm font-bold text-white tracking-wide">
                      CARTÃO DE IDENTIFICAÇÃO
                    </p>
                  </div>
                </div>
                <CreditCard className="h-6 w-6 text-slate-400" />
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-6">
              <div className="flex gap-6">
                {/* Foto */}
                <div className="flex flex-col items-center gap-3">
                  {/* Foto */}
                  <div className="relative">
                    {crianca.foto_url ? (
                      <Image
                        src={crianca.foto_url}
                        alt={crianca.nome_completo}
                        width={112}
                        height={144}
                        className="w-28 h-36 object-cover rounded-lg border-2 border-slate-300 shadow-md"
                      />
                    ) : (
                      <div className="w-28 h-36 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg border-2 border-slate-300 flex items-center justify-center shadow-md">
                        <User className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFotoChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors border border-slate-200"
                    >
                      <Camera className="h-4 w-4 text-slate-600" />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">A enviar...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dados */}
                <div className="flex-1 space-y-3">
                  {/* Apelidos */}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Apelidos / Surname</p>
                    <p className="text-lg font-bold text-slate-800 uppercase tracking-wide">
                      {getApelidos(crianca.nome_completo) || "-"}
                    </p>
                  </div>

                  {/* Nome */}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nome / Given names</p>
                    <p className="text-lg font-bold text-slate-800 uppercase tracking-wide">
                      {getPrimeiroNome(crianca.nome_completo)}
                    </p>
                  </div>

                  {/* Linha com Sexo, Nascimento, Idade */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sexo / Sex</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {crianca.sexo === "Masculino" ? "M" : crianca.sexo === "Feminino" ? "F" : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nascimento / Birth</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatDate(crianca.data_nascimento)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Idade / Age</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {calcularIdade(crianca.data_nascimento)} anos
                      </p>
                    </div>
                  </div>

                  {/* NIF e Processo */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">NIF</p>
                      <p className="text-sm font-semibold text-slate-800 font-mono">
                        {crianca.nif || "- - -"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nº Processo / Process No.</p>
                      <p className="text-sm font-semibold text-slate-800 font-mono">
                        {crianca.numero_processo || "- - -"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha inferior com datas */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Data Entrada / Entry Date</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {formatDate(crianca.data_entrada)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Estado / Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      crianca.estado === "Ativa"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}>
                      {crianca.estado}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Data Saída / Exit Date</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {crianca.data_saida ? formatDate(crianca.data_saida) : "- - -"}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Barra inferior */}
            <div className="h-1.5 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600"></div>
          </div>
        </div>
      </div>

      {/* Observações */}
      {crianca.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{crianca.observacoes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
