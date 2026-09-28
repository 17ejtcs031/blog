'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Printer, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatRelativeDate } from '@/lib/utils'

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${id}`)
        if (!res.ok) throw new Error('Failed to load post')
        setPost(await res.json())
      } catch {
        toast.error('Could not load post')
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [id])

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const res = await fetch(`/api/posts/${id}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      })
      if (!res.ok) throw new Error()
      toast.success('Post published successfully!')
      router.push('/posts')
    } catch {
      toast.error('Failed to publish post')
      setPublishing(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/preview/${id}`)
    toast.success('Link copied to clipboard')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Generating preview...</div>
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Post not found.</p>
        <Button asChild variant="outline"><Link href="/posts">Back to Posts</Link></Button>
      </div>
    )
  }

  const tags = post.tags?.map((t: any) => t.tag?.name).filter(Boolean) || []

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
      {/* Action Bar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" className="rounded-full font-display font-bold hover:bg-funky-purple/10" asChild>
            <Link href={`/editor/${id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor</Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-funky-purple/30 hover:bg-funky-purple/10 font-display font-bold" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            {post.status !== 'PUBLISHED' && (
              <Button size="sm" className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky" onClick={handlePublish} disabled={publishing}>
                {publishing ? 'Publishing...' : 'Publish Now 🚀'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          {post.category && (
            <Badge className="bg-funky-purple/15 text-funky-purple border-0 mb-6 rounded-full px-3 py-1 font-display font-bold">
              {post.category.name}
            </Badge>
          )}
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-gradient-fun leading-tight tracking-tight mb-4">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-light">
              {post.subtitle}
            </p>
          )}
          
          <div className="flex items-center justify-between py-4 border-y border-slate-100 dark:border-slate-800 mt-8 mb-12">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-950 shadow-sm">
                <AvatarImage src={post.author?.avatar || ''} alt={post.author?.name} />
                <AvatarFallback className="bg-funky animate-gradient text-white font-display font-extrabold">
                  {post.author?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{post.author?.name}</p>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatRelativeDate(post.publishedAt || post.createdAt)}</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime} min read</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-funky-purple/10 text-funky-purple hover:bg-funky-purple/20 hover:text-funky-pink" onClick={handleCopyLink} title="Copy link">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featuredImage} alt={post.title} className="w-full rounded-2xl mb-10 object-cover max-h-[420px]" />
        )}
        
        <div 
          className="prose dark:prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-a:text-funky-pink"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
        
        {tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-funky-purple/10 text-funky-purple rounded-full text-sm font-display font-bold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
