import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, UserRound } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import BlogPostClient from '@/components/blog-post-client'

async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      author: { select: { id: true, name: true, email: true, avatar: true, bio: true } },
      category: true,
      tags: { include: { tag: true } },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const tags = post.tags.map((entry) => entry.tag.name)
  const normalizedPost = {
    ...post,
    comments: post.comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to stories
        </Link>

        <article className="mx-auto mt-8 max-w-4xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-10">
          {post.category && (
            <span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
              {post.category.name}
            </span>
          )}

          <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="mt-4 text-xl text-slate-300">{post.subtitle}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-white/10 py-5 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 font-bold text-white">
                {post.author?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-semibold text-white">{post.author?.name || 'Author'}</p>
                <p className="text-xs text-slate-400">{post.author?.bio || 'Writer'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Published recently'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{post.readingTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-slate-400" />
              <span>{post._count.comments} comments</span>
            </div>
          </div>

          {post.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.featuredImage} alt={post.title} className="mt-8 h-[320px] w-full rounded-3xl object-cover" />
          )}

          <div
            className="prose prose-invert prose-lg mt-10 max-w-none prose-headings:font-display prose-headings:text-white prose-a:text-fuchsia-300 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon.</p>' }}
          />

          {tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <div className="mx-auto mt-12 max-w-4xl">
          <BlogPostClient post={normalizedPost} />
        </div>
      </div>
    </main>
  )
}
