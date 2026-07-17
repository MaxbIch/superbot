import { ArrowRight } from "lucide-react";
import Card from "./Card";

interface Props {
    title: string;
    image: string;
    description: string;
    onOpen: () => void;
}

export default function PlaceCard({
    title,
    image,
    description,
    onOpen,
}: Props) {
    return (
        <Card hover padding="none" className="overflow-hidden" onClick={onOpen}>
            <img
                src={image}
                alt={title}
                className="w-full h-44 sm:h-48 object-cover"
            />

            <div className="p-4">
                <h3 className="font-bold text-ink">{title}</h3>
                <p className="text-sm text-ink-muted mt-1 line-clamp-2">
                    {description}
                </p>

                <div className="mt-3 flex items-center gap-1 text-brand-600 text-sm font-semibold">
                    Подробнее
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Card>
    );
}
