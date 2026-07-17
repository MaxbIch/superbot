import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Card from "./Card";

interface Props {
    title: string;
    description: string;
    icon: string;
    path: string;
    accent?: string;
}

const accents = [
    "from-emerald-400/20 to-teal-500/10",
    "from-sky-400/20 to-blue-500/10",
    "from-amber-400/20 to-orange-500/10",
    "from-violet-400/20 to-purple-500/10",
    "from-rose-400/20 to-pink-500/10",
    "from-cyan-400/20 to-teal-500/10",
];

export default function CategoryCard({
    title,
    description,
    icon,
    path,
    accent,
}: Props) {
    const index = title.length % accents.length;
    const gradient = accent || accents[index];

    return (
        <Link to={path} className="block animate-fade-in-up">
            <Card hover padding="none" className="overflow-hidden group">
                <div className="flex items-center gap-4 p-4 sm:p-5">
                    <div
                        className={`
                            flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16
                            rounded-2xl bg-gradient-to-br ${gradient}
                            flex items-center justify-center text-3xl
                            group-hover:scale-105 transition-transform duration-300
                        `}
                    >
                        {icon}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-ink text-base sm:text-lg">
                            {title}
                        </h3>
                        <p className="text-sm text-ink-muted mt-0.5 line-clamp-2">
                            {description}
                        </p>
                    </div>

                    <ChevronRight
                        className="
                            w-5 h-5 text-brand-400 flex-shrink-0
                            group-hover:text-brand-600 group-hover:translate-x-0.5
                            transition-all
                        "
                    />
                </div>
            </Card>
        </Link>
    );
}
