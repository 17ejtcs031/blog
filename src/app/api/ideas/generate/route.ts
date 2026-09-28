import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateIdeas } from '@/lib/idea-generator';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { topic, audience, tone, contentType } = body;

    if (!topic) {
       return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const ideas = await generateIdeas({ topic, audience, tone, contentType });

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Generate ideas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
