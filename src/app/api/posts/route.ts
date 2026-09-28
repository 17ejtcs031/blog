import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { postSchema } from '@/lib/validations';
import { slugify, calculateReadingTime } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const whereClause: any = { authorId: session.id };
    if (status) whereClause.status = status;
    if (category) whereClause.categoryId = category;
    if (search) whereClause.title = { contains: search };

    let orderByClause: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderByClause = { createdAt: 'asc' };
    else if (sort === 'most-viewed') orderByClause = { views: 'desc' };
    else if (sort === 'most-liked') orderByClause = { likes: { _count: 'desc' } };

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        include: {
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, slug, subtitle, content, excerpt, featuredImage, status, categoryId, tags, seoTitle, seoDescription } = result.data;

    let baseSlug = slug ? slugify(slug) : slugify(title);
    let finalSlug = baseSlug;
    
    // Check if slug exists
    const existingPost = await prisma.post.findUnique({ where: { slug: finalSlug } });
    if (existingPost) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const readingTime = calculateReadingTime(content || '');
    const publishedAt = status === 'PUBLISHED' ? new Date() : null;

    const newPost = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        subtitle,
        content,
        excerpt,
        featuredImage,
        status,
        seoTitle,
        seoDescription,
        readingTime,
        publishedAt,
        authorId: session.id,
        categoryId,
        tags: tags && tags.length > 0 ? {
          create: tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      }
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
