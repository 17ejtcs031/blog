import Link from 'next/link'
import { ArrowRight, BookOpen, Heart, MessageSquareText, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'

async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      category: true,
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 6,
  })
}

export default async function HomePage() {
  const posts = await getPublishedPosts()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.3),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.25),transparent_30%),#020617]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-5 rounded-full border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                WriteSpace Journal
              </Badge>
              <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Publish stories worth reading.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300">
                Discover thoughtful articles from creators, bloggers, and professionals. Sign in to publish your own work, manage drafts, and join the conversation with comments and likes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-fuchsia-500 text-white hover:bg-fuchsia-400">
                  <Link href="/login">
                    Login to write
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-slate-600 bg-slate-900/40 text-white hover:bg-slate-800">
                  <Link href="/register">
                    Create account
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1">
              <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-sky-300" />
                  <span className="text-sm text-slate-200">Published posts</span>
                </div>
                <p className="mt-4 text-3xl font-black text-white">{posts.length}</p>
              </div>
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-rose-300" />
                  <span className="text-sm text-slate-200">Reader love</span>
                </div>
                <p className="mt-4 text-3xl font-black text-white">
                  {posts.reduce((sum, post) => sum + post._count.likes, 0)}
                </p>
              </div>
              <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                <div className="flex items-center gap-3">
                  <MessageSquareText className="h-5 w-5 text-violet-300" />
                  <span className="text-sm text-slate-200">Comments</span>
                </div>
                <p className="mt-4 text-3xl font-black text-white">
                  {posts.reduce((sum, post) => sum + post._count.comments, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Latest stories</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-white">Fresh from the blog</h2>
          </div>
          <Button asChild variant="ghost" className="hidden rounded-full text-fuchsia-200 hover:bg-fuchsia-500/10 sm:inline-flex">
            <Link href="/login">
              Manage your posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-fuchsia-400/30 hover:bg-white/10">
              <div className="mb-4 flex items-center justify-between gap-3">
                {post.category ? (
                  <Badge className="rounded-full border-violet-400/30 bg-violet-500/10 text-violet-100">
                    {post.category.name}
                  </Badge>
                ) : (
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">General</span>
                )}
                <span className="text-xs text-slate-400">{post.publishedAt ? formatDate(post.publishedAt) : 'Published'}</span>
              </div>

              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="font-display text-2xl font-extrabold text-white transition-colors group-hover:text-fuchsia-200">
                  {post.title}
                </h3>
              </Link>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                {post.excerpt || post.subtitle || 'Read the full story from the author.'}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                      {post.author?.name?.charAt(0) || 'A'}
                    </div>
                  </div>
                  <span>{post.author?.name || 'Author'}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {post._count.likes}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquareText className="h-3.5 w-3.5" /> {post._count.comments}</span>
                </div>
              </div>

              <Button asChild variant="secondary" className="mt-5 w-full rounded-full bg-slate-900/70 text-white hover:bg-slate-800">
                <Link href={`/blog/${post.slug}`}>
                  Read article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
