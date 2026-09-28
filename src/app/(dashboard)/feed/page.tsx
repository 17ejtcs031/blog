'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Heart, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeed() {
      try {
        const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
        const res = await fetch(`/api/posts/feed${query}`)
        if (!res.ok) {
          throw new Error('Failed to load feed')
        }
        const data = await res.json()
        setPosts(data.posts || [])
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadFeed()
  }, [search])

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Community feed</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900 dark:text-white">Discover published stories</h1>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search authors or topics"
            className="pl-9 border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="border-dashed border-slate-300 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Sparkles className="mb-4 h-12 w-12 text-violet-500" />
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">No published stories yet</h2>
            <p className="mt-2 max-w-md text-slate-500">There are no matching posts right now. Try a different search or check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-sm font-bold text-white">
                    {post.author?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{post.author?.name || 'Author'}</p>
                    <p className="text-xs text-slate-500">{formatDate(post.publishedAt || post.createdAt)}</p>
                  </div>
                </div>
                {post.category && (
                  <Badge className="rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-200">
                    {post.category.name}
                  </Badge>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <BookOpen className="h-3.5 w-3.5" />
                  Story
                </div>

                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="font-display text-2xl font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300">
                    {post.title}
                  </h2>
                </Link>

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {post.excerpt || post.subtitle || 'Read the full article to explore the author’s perspective.'}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {post._count.likes}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post._count.comments}</span>
                  <Button asChild size="sm" variant="secondary" className="rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                    <Link href={`/blog/${post.slug}`}>Read</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
