import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ideaSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const whereClause: any = { userId: session.id };
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const ideas = await prisma.idea.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Get ideas error:', error);
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
    const result = ideaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, targetAudience, contentType, keywords, difficulty, readingTime, tone } = result.data;

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        targetAudience,
        contentType,
        keywords,
        difficulty,
        readingTime,
        tone,
        userId: session.id,
      },
    });

    return NextResponse.json(idea);
  } catch (error) {
    console.error('Create idea error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
