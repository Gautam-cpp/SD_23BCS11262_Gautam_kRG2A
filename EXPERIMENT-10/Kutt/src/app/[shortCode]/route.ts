import { NextRequest, NextResponse } from 'next/server';
import { RedirectService } from '@/modules/redirect/service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ shortCode: string }> }) {
    try {
        const resolvedParams = await params;
        const shortCode = resolvedParams.shortCode;

        // Collect analytics data
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
        const referrer = req.headers.get('referer') || undefined;
        const userAgent = req.headers.get('user-agent') || undefined;
        // Vercel injects geo data as headers; cf-ipcountry is the Cloudflare equivalent
        const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || undefined;

        const clickData = {
            ipAddress: ipAddress?.split(',')[0].trim(), // get first IP in case of proxy chain
            referrer,
            userAgent,
            country,
        };

        const originalUrl = await RedirectService.getUrlAndRecordClick(shortCode, clickData);

        if (!originalUrl) {
            // It can be a 404 or 410, but 404 is a safe generic response
            return NextResponse.json({ error: 'Not Found or Expired' }, { status: 404 });
        }

        return NextResponse.redirect(originalUrl, { status: 301 });
    } catch (error) {
        console.error('Redirect Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
