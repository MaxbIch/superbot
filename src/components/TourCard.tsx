import { Link } from "react-router-dom";

import Card from "./Card";

interface Props {
    id: string;
    title: string;
    image: string;
    description: string;
}

export default function TourCard({ id, title, image, description }: Props) {
    return (
        <Link to={`/tours/${id}`} className="block">
            <Card hover padding="none" className="overflow-hidden group">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-44 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-lg text-ink">{title}</h3>
                    <p className="text-sm text-ink-muted mt-1.5 leading-relaxed line-clamp-1">
                        {description}
                    </p>
                </div>
            </Card>
        </Link>
    );
}
