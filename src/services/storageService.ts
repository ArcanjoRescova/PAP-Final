import { supabase } from "@/lib/supabase"

const BUCKET_NAME = "fotos-criancas"

export async function uploadFotoCrianca(
  criancaId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${criancaId}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return data.publicUrl
}

export async function removerFotoCrianca(fotoUrl: string): Promise<void> {
  const fileName = fotoUrl.split("/").pop()
  if (!fileName) return

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName])

  if (error) throw error
}

export function getFotoPlaceholder(nome: string): string {
  const initials = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=9333ea&color=fff&size=200`
}
