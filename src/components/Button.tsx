import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

const variants: Record<Variant, string> = {
    primary: `
        bg-gradient-to-r from-brand-600 to-brand-500
        text-white shadow-[var(--shadow-btn)]
        hover:from-brand-700 hover:to-brand-600
        active:scale-[0.98]
        disabled:from-brand-300 disabled:to-brand-300 disabled:shadow-none
    `,
    secondary: `
        bg-white text-brand-700 border border-brand-200
        hover:bg-brand-50 hover:border-brand-300
        active:scale-[0.98]
    `,
    outline: `
        bg-transparent text-ink border-2 border-border
        hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50/50
        active:scale-[0.98]
    `,
    ghost: `
        bg-transparent text-brand-700
        hover:bg-brand-50
        active:scale-[0.98]
    `,
};

const sizes: Record<Size, string> = {
    sm: "px-4 py-2 text-sm min-h-[40px] rounded-xl",
    md: "px-5 py-3 text-sm min-h-[48px] rounded-[var(--radius-btn)]",
    lg: "px-6 py-4 text-base min-h-[52px] rounded-[var(--radius-btn)]",
};

export default function Button({
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    icon,
    children,
    className = "",
    disabled,
    ...props
}: Props) {
    return (
        <button
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2
                font-semibold transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : icon ? (
                <span className="text-lg leading-none">{icon}</span>
            ) : null}
            {children}
        </button>
    );
}
