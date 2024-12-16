import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { Upload } from "lucide-react"
import { useAuthContext } from '../providers/AuthProvider'
import { auth } from '../lib/auth'

export function VideoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuthContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile)
      setMessage("")
    } else {
      setMessage("请选择视频文件")
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("请先选择视频文件")
      return
    }

    if (!user?.emailVerified) {
      setMessage("请先验证邮箱")
      return
    }

    if (!user?.trialUsed && !user?.isPremium) {
      try {
        await auth.useTrial()
      } catch (error) {
        setMessage("试用次数已用完，请升级会员")
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
        setMessage("视频上传成功！")
        setFile(null)
      } else {
        const errorMessage = data.error || '上传失败，请重试'
        setMessage(errorMessage)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage("上传出错，请检查视频大小是否超过500MB或重试")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <Upload className="w-12 h-12 text-gray-400 mb-2" />
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>

      {file && (
        <div className="text-sm text-gray-600">
          已选择: {file.name}
        </div>
      )}

      {message && (
        <div className={`text-sm ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? "上传中..." : "上传视频"}
      </Button>
    </div>
  )
}
