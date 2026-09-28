'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Upload, ImageIcon, Trash2, Search, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface MediaItem {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  createdAt: string
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media')
      if (res.ok) setMedia(await res.json())
    } catch {
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      toast.success('Image uploaded')
      loadMedia()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setMedia(media.filter(m => m.id !== id))
      toast.success('Image deleted')
    } catch {
      toast.error('Failed to delete image')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${url}`)
    toast.success('URL copied to clipboard')
  }

  const filtered = media.filter(m => m.filename.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gradient-fun flex items-center gap-2">
            <ImageIcon className="h-7 w-7 text-funky-pink" /> Media Library 🖼️
          </h1>
          <p className="text-slate-500 mt-1">Manage all your uploaded images and files.</p>
        </div>
        <Button className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Upload New
        </Button>
      </div>

      <div className="p-4 rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-funky-purple" />
          <Input
            placeholder="Search media..."
            className="pl-9 rounded-full border-0 bg-slate-100 dark:bg-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading && [1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="p-3"><Skeleton className="h-4 w-3/4" /></div>
          </div>
        ))}

        {!loading && filtered.map((img) => (
          <div key={img.id} className="group relative rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur overflow-hidden shadow-funky hover-lift flex flex-col">
            <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.filename} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" className="h-8 rounded-full" onClick={() => handleCopyUrl(img.url)}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy URL
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0 rounded-full"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Image?</AlertDialogTitle>
                      <AlertDialogDescription>This will permanently delete the image from your library.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(img.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-slate-800/50 text-sm">
              <p className="font-medium text-slate-900 dark:text-slate-100 truncate" title={img.filename}>{img.filename}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                <span>{formatFileSize(img.size)}</span>
                <span>{formatDate(img.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Upload Dropzone */}
        {!loading && (
          <div
            className="aspect-square w-full rounded-2xl border-2 border-dashed border-funky-purple/30 bg-white/60 dark:bg-slate-900/50 backdrop-blur hover:border-funky-pink hover:bg-funky-purple/5 transition-colors flex flex-col items-center justify-center text-center p-4 cursor-pointer text-funky-purple hover-lift"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
          >
            {uploading ? <Loader2 className="h-8 w-8 mb-2 animate-spin" /> : <Upload className="h-8 w-8 mb-2 opacity-70 animate-wiggle" />}
            <span className="text-sm font-display font-bold">Click or drag to upload</span>
            <span className="text-xs mt-1 opacity-70">JPG, PNG, GIF, WebP · max 5MB</span>
          </div>
        )}
      </div>

      {!loading && filtered.length === 0 && media.length > 0 && (
        <p className="text-center text-sm text-slate-500 py-8">No media matching &quot;{searchQuery}&quot;</p>
      )}
    </div>
  )
}
