import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    const liked = session?.id
      ? !!(await prisma.like.findUnique({
          where: {
            postId_userId: {
              postId: id,
              userId: session.id,
            },
          },
        }))
      : false

    const count = await prisma.like.count({ where: { postId: id } })

    return NextResponse.json({ liked, likes: count })
  } catch (error) {
    console.error('Like status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: session.id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } })
    } else {
      await prisma.like.create({
        data: {
          postId: id,
          userId: session.id,
        },
      })
    }

    const count = await prisma.like.count({ where: { postId: id } })

    return NextResponse.json({
      liked: !existingLike,
      likes: count,
    })
  } catch (error) {
    console.error('Toggle like error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
