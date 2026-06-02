"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Save, User, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { criarCrianca, atualizarCrianca } from "@/services/criancaService"
import { uploadFotoCrianca } from "@/services/storageService"

export default function NovaCriancaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    sexo: "",
    numero_processo: "",
    nif: "",
    data_entrada: "",
    estado: "Ativa",
    observacoes: "",
  })

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removerFoto = () => {
    setFotoFile(null)
    setFotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const crianca = await criarCrianca({
        ...form,
        sexo: form.sexo || null,
        numero_processo: form.numero_processo || null,
        nif: form.nif || null,
        data_entrada: form.data_entrada || null,
        data_saida: null,
        foto_url: null,
        observacoes: form.observacoes || null,
      })

      if (fotoFile && crianca.id) {
        const fotoUrl = await uploadFotoCrianca(crianca.id, fotoFile)
        await atualizarCrianca(crianca.id, { foto_url: fotoUrl })
      }

      router.push("/criancas")
    } catch (error) {
      console.error("Erro ao criar criança:", error)
      alert("Erro ao criar criança. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/criancas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Criança</h1>
          <p className="text-muted-foreground">
            Registar uma nova criança no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Criança</CardTitle>
          <CardDescription>
            Preencha os dados da criança a registar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fotografia</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {fotoPreview ? (
                    <div className="relative">
                      <Image
                        src={fotoPreview}
                        alt="Preview"
                        width={128}
                        height={128}
                        unoptimized
                        className="h-32 w-32 rounded-full object-cover border-4 border-purple-200"
                      />
                      <button
                        type="button"
                        onClick={removerFoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                    id="foto-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {fotoPreview ? "Alterar Foto" : "Adicionar Foto"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Formatos: JPG, PNG, GIF. Tamanho máximo: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Pessoais</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome_completo">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome_completo"
                    required
                    value={form.nome_completo}
                    onChange={(e) =>
                      setForm({ ...form, nome_completo: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    required
                    value={form.data_nascimento}
                    onChange={(e) =>
                      setForm({ ...form, data_nascimento: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">
                    Sexo <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="sexo"
                    required
                    value={form.sexo}
                    onChange={(e) =>
                      setForm({ ...form, sexo: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nif">NIF</Label>
                  <Input
                    id="nif"
                    value={form.nif}
                    onChange={(e) => setForm({ ...form, nif: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Informações do Processo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Processo</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="numero_processo">
                    Número do Processo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="numero_processo"
                    required
                    value={form.numero_processo}
                    onChange={(e) =>
                      setForm({ ...form, numero_processo: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_entrada">
                    Data de Entrada <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="data_entrada"
                    type="date"
                    required
                    value={form.data_entrada}
                    onChange={(e) =>
                      setForm({ ...form, data_entrada: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    value={form.estado}
                    onChange={(e) =>
                      setForm({ ...form, estado: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Desligada">Desligada</option>
                    <option value="Transferida">Transferida</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                rows={4}
                value={form.observacoes}
                onChange={(e) =>
                  setForm({ ...form, observacoes: e.target.value })
                }
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Link href="/criancas" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  "A guardar..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Criança
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
