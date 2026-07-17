import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: "sm" | "md" | "lg" | "none";
    onClick?: () => void;
}

const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
};

export default function Card({
    children,
    className = "",
    hover = false,
    padding = "md",
    onClick,
}: Props) {
    const Tag = onClick ? "button" : "div";

    return (
        <Tag
            onClick={onClick}
            className={`
                bg-surface rounded-[var(--radius-card)]
                shadow-[var(--shadow-card)]
                border border-white/60
                ${paddingMap[padding]}
                ${hover ? "transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 active:translate-y-0" : ""}
                ${onClick ? "w-full text-left cursor-pointer" : ""}
                ${className}
            `}
        >
            {children}
        </Tag>
    );
}
