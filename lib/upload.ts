import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function saveFile(file: File) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${Date.now()}-${file.name}`
  const uploadDir = join(process.cwd(), 'public/uploads')

  // Create uploads directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const filePath = join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  return `/uploads/${fileName}`
}

