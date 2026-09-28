import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()
    const limit = Math.min(Number(searchParams.get('limit') || 12), 30)
    const session = await getSession()

    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { subtitle: { contains: search } },
                { excerpt: { contains: search } },
                { author: { is: { name: { contains: search } } } },
              ],
            }
          : {}),
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    })

    const visiblePosts = session
      ? posts
      : posts.filter((post) => post.author && post.status === 'PUBLISHED')

    return NextResponse.json({ posts: visiblePosts })
  } catch (error) {
    console.error('Feed fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
