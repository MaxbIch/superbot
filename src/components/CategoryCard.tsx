import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Card from "./Card";

interface Props {
    title: string;
    description: string;
    image: string;
    path: string;
}

export default function CategoryCard({
    title,
    description,
    image,
    path,
}: Props) {
    return (
        <Link to={path} className="block animate-fade-in-up">
            <Card hover padding="none" className="overflow-hidden group">
                <div className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-ink text-base sm:text-lg">
                            {title}
                        </h3>
                        <p className="text-sm text-ink-muted mt-0.5 line-clamp-2">
                            {description}
                        </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-brand-400 flex-shrink-0 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                </div>
            </Card>
        </Link>
    );
}
