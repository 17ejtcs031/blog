'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, LogIn, MessageSquareText, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface BlogComment {
  id: string
  content: string
  createdAt: Date | string
  author: { id: string; name: string; avatar: string | null }
}

interface BlogPostClientProps {
  post: {
    id: string
    title: string
    content: string | null
    comments: BlogComment[]
    _count: {
      likes: number
      comments: number
    }
  }
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const { user } = useSession()
  const [likes, setLikes] = useState(post._count.likes)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState(post.comments)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like posts.')
      return
    }

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Unable to update like status')

      setLiked(data.liked)
      setLikes(data.likes)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update like status')
    }
  }

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) {
      toast.error('Please log in to leave a comment.')
      return
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to post comment')

      setComments((current) => [data.comment, ...current])
      setCommentText('')
      toast.success('Comment posted.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 pt-4">
        <Button
          type="button"
          variant={liked ? 'default' : 'outline'}
          className={liked ? 'rounded-full bg-rose-500 text-white' : 'rounded-full border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}
          onClick={handleLike}
        >
          <Heart className="mr-2 h-4 w-4" />
          {likes} likes
        </Button>

        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          <MessageSquareText className="mr-2 h-4 w-4" />
          {comments.length} comments
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
        <h3 className="mb-4 font-display text-2xl font-bold text-white">Join the discussion</h3>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 border-white/10 bg-slate-950/70 text-white placeholder:text-slate-400"
            />
            <Button type="submit" disabled={submitting} className="rounded-full bg-fuchsia-500 text-white hover:bg-fuchsia-400">
              <Send className="mr-2 h-4 w-4" />
              {submitting ? 'Posting...' : 'Comment'}
            </Button>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-300">
            <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-fuchsia-300 hover:text-fuchsia-200">
              <LogIn className="h-4 w-4" />
              Log in to leave a comment
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
            No comments yet. Be the first to share your thoughts.
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                  {comment.author?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-white">{comment.author?.name || 'Reader'}</p>
                  <p className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-slate-200">{comment.content}</p>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
