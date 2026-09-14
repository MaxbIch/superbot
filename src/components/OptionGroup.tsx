interface Props {
    title: string;
    options: string[];
    value?: string;
    onChange: (value: string) => void;
}

export default function OptionGroup({
    title,
    options,
    value,
    onChange,
}: Props) {
    return (
        <div>
            <h3 className="font-semibold text-ink mb-1 text-sm sm:text-base">
                {title}
            </h3>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const selected = value === option;

                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`
                                px-4 py-2.5 rounded-xl text-sm font-medium
                                border-2 transition-all duration-200
                                min-h-[44px]
                                ${
                                    selected
                                        ? "bg-brand-600 text-white border-brand-600 shadow-[var(--shadow-btn)] scale-[1.02]"
                                        : "bg-surface-muted text-ink border-border hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98]"
                                }
                            `}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
