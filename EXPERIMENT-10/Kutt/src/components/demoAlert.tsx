import Link from 'next/link';

export function DemoAlert() {
    return (
        <div
            className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl animate-fade-up"
            style={{
                background: '#fffbeb',
                border: '1.5px solid #fde68a',
                borderTop: '4px solid #f59e0b',
                transform: 'rotate(-0.6deg)',
            }}
        >
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <p className="text-sm text-amber-900">
                This link is for <strong>demo purposes</strong> only and will be deleted in <strong>1 minute</strong>.{' '}
                <Link href="/login" className="text-[var(--brand)] underline underline-offset-2 decoration-dotted hover:text-[var(--brand-mid)]">
                    Log in or sign up →
                </Link>{' '}
                to keep your links.
            </p>
        </div>
    );
}