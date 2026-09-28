import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { postSchema } from '@/lib/validations';
import { calculateReadingTime, slugify } from '@/lib/utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
        author: { select: { id: true, name: true, avatar: true, bio: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        },
        _count: { select: { likes: true, comments: true } }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Verify post belongs to authenticated user (or is published)
    if (post.status !== 'PUBLISHED') {
      const session = await getSession();
      if (!session || session.id !== post.authorId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
    const readingTime = calculateReadingTime(content || '');
    
    let publishedAt = existingPost.publishedAt;
    if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' && !publishedAt) {
      publishedAt = new Date();
    }

    let slugUpdate = {};
    if (slug && slugify(slug) !== existingPost.slug) {
      const candidate = slugify(slug);
      const conflict = await prisma.post.findUnique({ where: { slug: candidate } });
      if (conflict && conflict.id !== id) {
        return NextResponse.json({ error: 'Slug already in use by another post' }, { status: 400 });
      }
      slugUpdate = { slug: candidate };
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        subtitle,
        content,
        excerpt,
        featuredImage,
        status,
        seoTitle,
        seoDescription,
        categoryId,
        readingTime,
        publishedAt,
        ...slugUpdate,
        tags: {
          deleteMany: {}, // Delete existing tag connections
          create: tags?.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        }
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
