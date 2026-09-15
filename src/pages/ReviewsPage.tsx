import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Card from "../components/Card";

interface Review {
    id: string;
    username: string;
    text: string;
    rating: number;
    date?: string;
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`Оценка ${rating} из 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= rating ? "text-amber-400" : "text-slate-200"}>
                    ★
                </span>
            ))}
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/reviews")
            .then(async (response) => {
                if (!response.ok) throw new Error("Failed to load reviews");
                return response.json() as Promise<{ reviews?: Review[] }>;
            })
            .then((data) => {
                if (!cancelled) setReviews(data.reviews ?? []);
            })
            .catch((error) => {
                console.error("reviews load error:", error);
                if (!cancelled) setReviews([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Layout>
            <BackButton />

            <div className="mb-5 animate-fade-in-up">
                <span className="text-4xl">⭐</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">
                    Отзывы клиентов
                </h1>
                <p className="text-ink-muted mt-1 text-sm">
                    Что говорят о Super Bot Nha Trang
                </p>
            </div>

            {loading ? (
                <Card className="text-center animate-fade-in-up" padding="lg">
                    <div className="text-4xl mb-3 animate-pulse">⭐</div>
                    <p className="text-sm text-ink-muted">Загружаем отзывы…</p>
                </Card>
            ) : reviews.length === 0 ? (
                <Card className="text-center animate-fade-in-up" padding="lg">
                    <div className="text-5xl mb-4">💬</div>
                    <h2 className="font-bold text-lg text-ink mb-2">
                        Отзывы скоро появятся
                    </h2>
                    <p className="text-sm text-ink-muted leading-relaxed">
                        Оставьте отзыв в Telegram — после выбора оценки он появится здесь автоматически.
                    </p>
                </Card>
            ) : (
                <div className="space-y-4 animate-fade-in-up">
                    {reviews.map((review) => (
                        <Card key={review.id} padding="md">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="min-w-0">
                                    <h2 className="font-bold text-ink truncate">
                                        {review.username}
                                    </h2>
                                    {review.date && (
                                        <p className="text-xs text-ink-muted mt-0.5">
                                            {formatDate(review.date)}
                                        </p>
                                    )}
                                </div>
                                <Stars rating={review.rating} />
                            </div>
                            <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
                                {review.text}
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </Layout>
    );
}
