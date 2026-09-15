import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Card from "../components/Card";
import { getTelegramUser } from "../lib/telegram";

import { reviews as demoReviews, type Review } from "../data/reviews";

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`Оценка ${rating} из 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= rating ? "text-amber-400" : "text-slate-200"}>★</span>
            ))}
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>(demoReviews);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState("");

    const telegramUser = getTelegramUser();
    const telegramName = telegramUser?.username
        ? `@${telegramUser.username}`
        : [telegramUser?.first_name, telegramUser?.last_name].filter(Boolean).join(" ");

    useEffect(() => {
        let cancelled = false;
        fetch("/api/reviews")
            .then(async (response) => {
                if (!response.ok) throw new Error("Failed to load reviews");
                return response.json() as Promise<{ reviews?: Review[] }>;
            })
            .then((data) => {
                if (cancelled) return;
                const liveReviews = (data.reviews ?? []).filter((review) => !demoReviews.some((demo) => demo.id === review.id));
                setReviews([...liveReviews, ...demoReviews]);
            })
            .catch((error) => {
                console.error("reviews load error:", error);
                if (!cancelled) setReviews(demoReviews);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormMessage("");

        const initData = window.Telegram?.WebApp?.initData ?? "";
        if (!initData) {
            setFormMessage("Открыть отзывы нужно внутри Telegram.");
            return;
        }
        if (rating < 1 || rating > 5) {
            setFormMessage("Пожалуйста, поставьте оценку от 1 до 5 звёзд.");
            return;
        }
        if (text.trim().length < 3) {
            setFormMessage("Напишите отзыв минимум из 3 символов.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.trim(), rating, name: name.trim(), initData }),
            });
            const data = (await response.json()) as { review?: Review; error?: string };
            if (!response.ok || !data.review) throw new Error(data.error ?? "Не удалось сохранить отзыв");

            setReviews((current) => [data.review!, ...current.filter((item) => item.id !== data.review!.id)]);
            setText("");
            setName("");
            setRating(0);
            setFormMessage("Спасибо! Ваш отзыв опубликован ⭐");
        } catch (error) {
            setFormMessage(error instanceof Error ? error.message : "Не удалось сохранить отзыв");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Layout>
            <BackButton />
            <div className="mb-5 animate-fade-in-up">
                <span className="text-4xl">⭐</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">Отзывы клиентов</h1>
                <p className="text-ink-muted mt-1 text-sm">Что говорят о Super Bot Nha Trang</p>
            </div>

            <Card className="mb-5 animate-fade-in-up" padding="md">
                <div className="mb-4">
                    <h2 className="font-bold text-lg text-ink">Оставить отзыв</h2>
                    <p className="text-xs text-ink-muted mt-1">Имя можно указать или оставить пустым.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="review-name" className="text-sm font-medium text-ink block mb-2">
                            Ваше имя <span className="text-ink-muted font-normal">(необязательно)</span>
                        </label>
                        <input
                            id="review-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            maxLength={80}
                            placeholder={telegramName || "Житель Нячанга"}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-ink mb-2">Ваша оценка <span className="text-red-500">*</span></p>
                        <div className="flex items-center gap-1" role="radiogroup" aria-label="Ваша оценка">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button key={value} type="button" onClick={() => setRating(value)}
                                    className={`text-3xl leading-none transition-transform hover:scale-110 ${value <= rating ? "text-amber-400" : "text-slate-200"}`}
                                    aria-label={`${value} из 5`} aria-pressed={value === rating}>★</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="review-text" className="text-sm font-medium text-ink block mb-2">Ваш отзыв <span className="text-red-500">*</span></label>
                        <textarea id="review-text" value={text} onChange={(event) => setText(event.target.value)} maxLength={1000} rows={4}
                            placeholder="Расскажите, чем вам помог Super Bot…"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none" />
                        <p className="text-[11px] text-ink-muted mt-1 text-right">{text.length}/1000</p>
                    </div>

                    <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-ink text-white py-3 px-4 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50">
                        {submitting ? "Публикуем…" : "Опубликовать отзыв"}
                    </button>
                    {formMessage && <p className="text-sm text-center text-ink-muted" role="status">{formMessage}</p>}
                </form>
            </Card>

            {loading ? (
                <Card className="text-center animate-fade-in-up" padding="lg"><div className="text-4xl mb-3 animate-pulse">⭐</div><p className="text-sm text-ink-muted">Загружаем отзывы…</p></Card>
            ) : reviews.length === 0 ? (
                <Card className="text-center animate-fade-in-up" padding="lg"><div className="text-5xl mb-4">💬</div><h2 className="font-bold text-lg text-ink mb-2">Отзывы скоро появятся</h2><p className="text-sm text-ink-muted leading-relaxed">Оставьте первый отзыв прямо здесь.</p></Card>
            ) : (
                <div className="space-y-4 animate-fade-in-up">
                    {reviews.map((review) => (
                        <Card key={review.id} padding="md">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="min-w-0"><h2 className="font-bold text-ink truncate">{review.username}</h2>{review.date && <p className="text-xs text-ink-muted mt-0.5">{formatDate(review.date)}</p>}</div>
                                <Stars rating={review.rating} />
                            </div>
                            <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{review.text}</p>
                        </Card>
                    ))}
                </div>
            )}
        </Layout>
    );
}
