import { useState } from "react";

import Card from "./Card";
import Button from "./Button";

import { submitLead } from "../services/leadService";
import { hapticFeedback } from "../lib/telegram";

interface Props {
    title: string;
    image: string;
    description: string;
}

export default function TourCard({ title, image, description }: Props) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleBook = async () => {
        setLoading(true);

        try {
            await submitLead({
                category: "tours",
                title: "Заявка на тур",
                emoji: "🌴",
                fields: { Тур: title },
            });

            hapticFeedback("success");
            setSent(true);
        } catch {
            hapticFeedback("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card hover padding="none" className="overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-44 sm:h-52 object-cover"
            />

            <div className="p-4 sm:p-5">
                <h3 className="font-bold text-lg text-ink">{title}</h3>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {description}
                </p>

                <div className="mt-4">
                    {sent ? (
                        <div className="text-center py-2 text-brand-600 font-semibold text-sm">
                            ✅ Заявка отправлена!
                        </div>
                    ) : (
                        <Button
                            fullWidth
                            variant="secondary"
                            loading={loading}
                            onClick={handleBook}
                        >
                            Забронировать тур
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
