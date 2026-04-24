import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/modules/analytics/service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ shortCode: string }> }) {
    try {
        const resolvedParams = await params;
        const shortCode = resolvedParams.shortCode;

        const data = await AnalyticsService.getAnalytics(shortCode);

        if (!data) {
            return NextResponse.json({ error: 'Short URL not found' }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
