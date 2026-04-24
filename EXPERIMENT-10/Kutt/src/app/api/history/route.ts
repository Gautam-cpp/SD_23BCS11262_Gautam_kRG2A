import { NextResponse } from "next/server";
import prisma from '@/lib';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-expect-error - session.user.id is added in callbacks
    const { id } = session.user;

    const records = await prisma.url.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const baseDomain = process.env.BASE_DOMAIN || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const history = records.map((record) => {
      const shortUrl = `${protocol}://${baseDomain}/${record.shortCode}`;
      return {
        ...record,
        shortUrl,
        clicks: record.clickCount,
      };
    });

    return NextResponse.json({ history }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
