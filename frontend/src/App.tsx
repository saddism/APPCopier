import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { Upload } from "lucide-react"

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

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

    setUploading(true)
    const formData = new FormData()
    formData.append('video', file)

    try {
      const response = await fetch('https://user:f55d085a94efa2626479ee9391805694@video-analysis-app-tunnel-diwqngzg.devinapps.com/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("视频上传成功！")
        setFile(null)
      } else {
        setMessage(`上传失败: ${data.error}`)
      }
    } catch (error) {
      setMessage("上传出错，请重试")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">APP视频分析系统</h1>

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
        </div>
      </div>
    </div>
  )
}

export default App
