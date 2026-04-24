import { Feature } from './feature';
import Link from 'next/link';
import Image from 'next/image';

const features = [
    {
        icon: (
            <svg className="w-5 h-5 stroke-white stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M20 14.7V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.3" />
                <path d="m18 2 4 4-10 10H8v-4z" />
            </svg>
        ),
        heading: 'Manage links',
        text: 'Create, protect and delete your links and monitor them with detailed statistics.',
    },
    {
        icon: (
            <svg className="w-5 h-5 stroke-white stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M16 3h5v5M4 20 20.2 3.8M21 16v5h-5m-1-6 5.1 5.1M4 4l5 5" />
            </svg>
        ),
        heading: 'Custom domain',
        text: 'Use custom domains for your links. Add or remove them for free.',
    },
    {
        icon: (
            <svg className="w-5 h-5 stroke-white stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
            </svg>
        ),
        heading: 'API access',
        text: 'Use the provided API to create, delete, and get URLs from anywhere.',
    },
    {
        icon: (
            <svg className="w-5 h-5 stroke-white stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
        ),
        heading: 'Free & open source',
        text: 'Completely open source and free. Host it on your own server.',
    },
];

export function DemoDashboard() {
    return (
        <>
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10 py-20">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-5 flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-snug">
                        Manage links, set custom{' '}
                        <span className="text-brand">domains</span> and view{' '}
                        <span className="text-brand">stats</span>.
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-sm">
                        Sign up for free and get access to link management, analytics and more.
                    </p>
                    <Link href="/login" className="btn-brand no-underline">
                        Login / Sign up
                    </Link>
                </div>
                <div className="flex-1 flex justify-center">
                    <Image
                        src="/callout.png"
                        alt="Kutt dashboard preview"
                        width={600}
                        height={400}
                        className="w-full h-auto max-w-sm sm:max-w-md rounded-2xl shadow-xl"
                    />
                </div>
            </section>

            <section className="w-full bg-[hsl(230,15%,94%)] py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">Why Kutt?</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-12 text-center">
                        Kutt‑ting edge features.
                    </h2>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f) => (
                            <Feature key={f.heading} icon={f.icon} heading={f.heading} text={f.text} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}