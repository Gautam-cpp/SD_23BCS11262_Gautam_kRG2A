'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { clearCache } from '@/lib/historyCache';

export function Appbar() {
    const { data: session, status } = useSession();
    const isAuth = !!session;
    const isLoading = status === "loading";
    // @ts-expect-error - id is added in callbacks
    const userId = String(session?.user?.id ?? '');
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        if (userId) clearCache(userId);
        await signOut({ redirect: false });
        router.push('/');
        setMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-[1.15rem] text-[var(--text)] hover:text-brand transition-colors no-underline shrink-0">
                    <Image src="/logo.svg" alt="Kutt logo" width={18} height={24} className="aspect-auto" />
                    Kutt
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--text-muted)]">
                    <a href="https://github.com/gautam-cpp/kutt" target="_blank" rel="noopener noreferrer"
                        className="hover:text-brand transition-colors no-underline">
                        GitHub
                    </a>
                    <Link href="/report" className="hover:text-brand transition-colors no-underline">
                        Report
                    </Link>
                    <a href="#" className="hover:text-brand transition-colors no-underline">
                        Premium
                    </a>
                </nav>

                <div className="hidden md:flex items-center min-w-[120px] justify-end">
                    {isLoading ? (
                        <span className="inline-block w-5 h-5 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin-slow" />
                    ) : isAuth ? (
                        <button
                            onClick={handleLogout}
                            className="btn-brand cursor-pointer border-none"
                            aria-label="Log out"
                        >
                            Log out
                        </button>
                    ) : (
                        <Link href="/login" className="btn-brand no-underline">
                            Login / Sign up
                        </Link>
                    )}
                </div>

                <button
                    className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer border-none bg-transparent"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-[var(--border)] bg-white animate-fade-up">
                    <nav className="flex flex-col px-4 py-4 gap-3 text-sm text-[var(--text-muted)]">
                        <a href="https://github.com/Gautam-cpp" target="_blank" rel="noopener noreferrer"
                            className="py-2 hover:text-brand transition-colors no-underline" onClick={() => setMenuOpen(false)}>
                            GitHub
                        </a>
                        <Link href="/report" className="py-2 hover:text-brand transition-colors no-underline" onClick={() => setMenuOpen(false)}>
                            Report
                        </Link>
                        <a href="#" className="py-2 hover:text-brand transition-colors no-underline" onClick={() => setMenuOpen(false)}>
                            Premium
                        </a>
                        <div className="pt-2 border-t border-[var(--border)]">
                            {isLoading ? (
                                <div className="flex justify-center py-2">
                                    <span className="inline-block w-5 h-5 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin-slow" />
                                </div>
                            ) : isAuth ? (
                                <button onClick={handleLogout} className="btn-brand w-full border-none cursor-pointer text-center">
                                    Log out
                                </button>
                            ) : (
                                <Link href="/login" className="btn-brand w-full no-underline text-center block" onClick={() => setMenuOpen(false)}>
                                    Login / Sign up
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
