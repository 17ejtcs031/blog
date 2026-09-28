import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ posts: [], ideas: [], categories: [] });
    }

    const [posts, ideas, categories] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: session.id,
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        select: { id: true, title: true, excerpt: true, status: true },
        take: 5,
      }),
      prisma.idea.findMany({
        where: {
          userId: session.id,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: { id: true, title: true, description: true },
        take: 5,
      }),
      prisma.category.findMany({
        where: {
          name: { contains: q },
        },
        select: { id: true, name: true, slug: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({ posts, ideas, categories });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
