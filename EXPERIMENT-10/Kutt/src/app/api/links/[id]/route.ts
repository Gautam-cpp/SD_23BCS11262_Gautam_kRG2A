import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import redis from '@/lib/redis';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-expect-error - session.user.id is added in callbacks
    const userId = Number(session.user.id);
    const { id } = await params;
    const urlId = Number(id);

    if (isNaN(urlId)) {
      return NextResponse.json({ error: 'Invalid link ID' }, { status: 400 });
    }

    const urlRecord = await prisma.url.findUnique({
      where: { id: urlId },
      select: { id: true, userId: true, shortCode: true },
    });

    if (!urlRecord) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (urlRecord.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.url.delete({ where: { id: urlId } });

    if (urlRecord.shortCode) {
      await redis.del(`url:${urlRecord.shortCode}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
