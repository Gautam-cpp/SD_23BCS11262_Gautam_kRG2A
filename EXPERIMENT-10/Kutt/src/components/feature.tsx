interface FeatureProps {
    icon: React.ReactNode;
    heading: string;
    text: string;
}

export function Feature({ icon, heading, text }: FeatureProps) {
    return (
        <div className="flex flex-col items-center text-center px-4 py-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--brand)] mb-4 shadow-[0_4px_14px_var(--brand-glow)] group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-[var(--text)] mb-2">{heading}</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{text}</p>
        </div>
    );
}