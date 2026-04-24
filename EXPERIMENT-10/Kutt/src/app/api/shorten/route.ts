import { NextRequest, NextResponse } from 'next/server';
import { shortenUrlSchema } from '@/modules/url/schema';
import { UrlService } from '@/modules/url/service';
import { rateLimit } from '@/middleware/rateLimiter';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Middleware
  const rateLimitResponse = await rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error - session.user.id is added in callbacks
    const userId = session?.user?.id ? Number(session.user.id) : undefined;
    
    const body = await req.json().catch(() => ({}));

    // 2. Validate Request Body
    const parseResult = shortenUrlSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { url, expiry } = parseResult.data;

    const now = Date.now();
    const expiryDate = expiry
      ? new Date(expiry)
      : userId
        ? new Date(now + 24 * 60 * 60 * 1000)
        : new Date(now + 3 * 60 * 60 * 1000);

    if (expiryDate && expiryDate <= new Date()) {
      return NextResponse.json(
        { error: 'Expiry date must be in the future' },
        { status: 400 }
      );
    }

    // 3. Create Short URL via Service
    const { shortCode, id, createdAt } = await UrlService.shortenUrl(url, expiryDate, userId);

    // 4. Return Response
    const baseDomain = process.env.BASE_DOMAIN || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const shortUrl = `${protocol}://${baseDomain}/${shortCode}`;

    return NextResponse.json({
      shortUrl,
      id: String(id),
      longUrl: url,
      createdAt: createdAt.toISOString(),
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Shorten API Error:', error);

    console.error('Shorten API Error:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
