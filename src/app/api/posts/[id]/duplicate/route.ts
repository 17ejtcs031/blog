import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sourcePost = await prisma.post.findUnique({ 
      where: { id },
      include: { tags: true } 
    });
    
    if (!sourcePost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (sourcePost.authorId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const newTitle = `${sourcePost.title} (Copy)`;
    let baseSlug = slugify(newTitle);
    let finalSlug = baseSlug;
    
    const existingSlug = await prisma.post.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const newPost = await prisma.post.create({
      data: {
        title: newTitle,
        slug: finalSlug,
        content: sourcePost.content,
        excerpt: sourcePost.excerpt,
        featuredImage: sourcePost.featuredImage,
        status: 'DRAFT',
        readingTime: sourcePost.readingTime,
        authorId: session.id,
        categoryId: sourcePost.categoryId,
        tags: sourcePost.tags && sourcePost.tags.length > 0 ? {
          create: sourcePost.tags.map(pt => ({
            tag: { connect: { id: pt.tagId } }
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
    console.error('Duplicate post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
