interface Props {
    tabs: string[];
    active: string;
    onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
    return (
        <div
            className="
                flex gap-2 mb-5 overflow-x-auto pb-1
                -mx-1 px-1 scrollbar-hide
            "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            {tabs.map((tab) => {
                const isActive = active === tab;

                return (
                    <button
                        key={tab}
                        onClick={() => onChange(tab)}
                        className={`
                            flex-shrink-0 px-4 py-2.5 rounded-xl
                            text-sm font-semibold transition-all duration-200
                            min-h-[44px]
                            ${
                                isActive
                                    ? "bg-brand-600 text-white shadow-[var(--shadow-btn)]"
                                    : "bg-white/80 text-ink-muted hover:bg-white hover:text-ink border border-border"
                            }
                        `}
                    >
                        {tab}
                    </button>
                );
            })}
        </div>
    );
}
