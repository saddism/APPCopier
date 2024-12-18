import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { useAuthContext } from '@/providers/AuthProvider'
import { auth } from '@/lib/auth'
import { useTranslation } from '@/lib/translations'

export function VideoUploader() {
  const [file, setFile] = React.useState<File | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const { user } = useAuthContext()
  const { t } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile)
      setMessage("")
    } else {
      setMessage(t('upload.error.invalidType'))
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage(t('upload.error.noFile'))
      return
    }

    if (!user?.emailVerified) {
      setMessage(t('upload.error.verifyEmail'))
      return
    }

    if (!user?.trialUsed && !user?.isPremium) {
      try {
        await auth.useTrial()
      } catch (error) {
        setMessage(t('upload.error.trialUsed'))
        return
      }
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('video', file)

    try {
      const baseUrl = 'https://video-analysis-app-tunnel-dgup6riq.devinapps.com/api/upload'
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('devin:8d55f0c17d37edef9d44c20307bbfbfb')
        },
        body: formData,
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(t('upload.success'))
        setFile(null)
      } else {
        const errorMessage = data.error || t('upload.error.default')
        setMessage(errorMessage)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage(t('upload.error.sizeLimitExceeded'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-4">{t('upload.selectVideo')}</p>
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full max-w-sm"
        />
      </div>

      {file && (
        <div className="text-sm text-gray-600">
          {t('upload.selected')}: {file.name}
        </div>
      )}

      {message && (
        <div className={`text-sm ${message.includes(t('upload.success')) ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? t('upload.uploading') : t('upload.uploadButton')}
      </Button>
    </div>
  )
}
