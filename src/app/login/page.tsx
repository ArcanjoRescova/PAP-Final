"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/services/authService"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(form.email, form.password)
      router.push("/")
    } catch (err: unknown) {
      console.error("Erro no login:", err)
      setError("Email ou palavra-passe incorretos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 items-center justify-center p-12">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Lar Santo António"
            width={128}
            height={128}
            className="h-32 w-32 mx-auto mb-8 object-contain"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Lar Santo António
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Encontrar o caminho da vida,
          </p>
          <p className="text-xl text-white/80">
            A arte de viver!
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/logo.png"
              alt="Lar Santo António"
              width={80}
              height={80}
              className="h-20 w-20 mx-auto mb-4 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">Lar Santo António</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Bem-vindo</h2>
              <p className="text-gray-500 mt-2">
                Entre com as suas credenciais
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@larsantoantonio.pt"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                {loading ? "A entrar..." : "Entrar"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            © Lar Santo António - Sistema de Gestão
          </p>
        </div>
      </div>
    </div>
  )
}
