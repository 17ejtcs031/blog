import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: session.id },
      include: {
        category: true,
        _count: { select: { comments: true, likes: true } }
      }
    });

    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'PUBLISHED').length;
    const draftPosts = posts.filter(p => p.status === 'DRAFT').length;
    const archivedPosts = posts.filter(p => p.status === 'ARCHIVED').length;
    
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post._count.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post._count.comments, 0);

    // Aggregate real view events by day for the last 90 days
    const since = new Date();
    since.setDate(since.getDate() - 89);
    since.setHours(0, 0, 0, 0);

    const viewEvents = await prisma.viewEvent.findMany({
      where: {
        postId: { in: posts.map(p => p.id) },
        createdAt: { gte: since },
      },
      select: { createdAt: true },
    });

    const viewsByDay = new Map<string, number>();
    for (const event of viewEvents) {
      const key = event.createdAt.toISOString().split('T')[0];
      viewsByDay.set(key, (viewsByDay.get(key) || 0) + 1);
    }

    const viewsByDate = Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      const key = date.toISOString().split('T')[0];
      return { date: key, views: viewsByDay.get(key) || 0 };
    });

    const postsPerMonth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.getMonth();
      const year = date.getFullYear();
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        count: posts.filter(p => {
          const created = new Date(p.createdAt);
          return created.getMonth() === month && created.getFullYear() === year;
        }).length,
      };
    });

    const topPosts = [...posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(p => ({ id: p.id, title: p.title, views: p.views }));

    const categoryPerformance = posts.reduce((acc: any, post) => {
      if (post.category) {
        if (!acc[post.category.name]) acc[post.category.name] = 0;
        acc[post.category.name] += post.views;
      }
      return acc;
    }, {});

    return NextResponse.json({
      stats: { totalPosts, publishedPosts, draftPosts, archivedPosts, totalViews, totalLikes, totalComments },
      charts: { viewsByDate, postsPerMonth },
      topPosts,
      categoryPerformance: Object.entries(categoryPerformance).map(([name, views]) => ({ name, views }))
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
