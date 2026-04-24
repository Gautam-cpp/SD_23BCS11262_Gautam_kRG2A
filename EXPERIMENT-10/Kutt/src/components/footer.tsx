import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="w-full border-t-2 border-[var(--border)] mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">

                    <div className="col-span-2 sm:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-[var(--text)] no-underline mb-3 group w-fit">
                            <div className="w-6 h-6 rounded-md bg-[var(--brand)] flex items-center justify-center shadow-[2px_2px_0_var(--brand-deep)] group-hover:rotate-6 transition-transform duration-300">
                                <Image src="/logo.svg" alt="Kutt" width={12} height={16} className="brightness-0 invert" />
                            </div>
                            <span style={{ fontFamily: "'Syne', sans-serif" }}>Kutt</span>
                        </Link>
                        <p className="text-sm text-[var(--text-muted)] max-w-[200px] leading-relaxed">
                            Free, modern and open-source URL shortener.
                        </p>
                    </div>

                    <div>
                        <h4
                            className="text-xs font-bold uppercase tracking-widest text-[var(--text)] mb-4"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            Product
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm">
                            <li><Link href="/login" className="text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors no-underline">Sign up free</Link></li>
                            <li><a href="#" className="text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors no-underline">Premium</a></li>
                            <li><Link href="/report" className="text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors no-underline">Report a link</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4
                            className="text-xs font-bold uppercase tracking-widest text-[var(--text)] mb-4"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            Connect
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm">
                            <li>
                                <a href="https://github.com/Gautam-cpp" target="_blank" rel="noopener noreferrer"
                                    className="text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors no-underline inline-flex items-center gap-1.5 group">
                                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/gautam11-cpp/" target="_blank" rel="noopener noreferrer"
                                    className="text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors no-underline inline-flex items-center gap-1.5 group">
                                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.73a1.77 1.77 0 1 1 0-3.54 1.77 1.77 0 0 1 0 3.54zM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77C14.4 7.42 20 7.26 20 12.9V19z" />
                                    </svg>
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span>Made with love by Gautam Prajapat</span>
                    <span>© {new Date().getFullYear()} Kutt. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}