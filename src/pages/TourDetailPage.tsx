import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Card from "../components/Card";
import Button from "../components/Button";
import OptionGroup from "../components/OptionGroup";
import { submitLead } from "../services/leadService";
import { hapticFeedback } from "../lib/telegram";
import { tours } from "../data/tours";

function formatDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
}

export default function TourDetailPage() {
    const { id } = useParams();
    const tour = tours.find((item) => item.id === id);
    const [slide, setSlide] = useState(0);
    const [people, setPeople] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    if (!tour) {
        return (
            <Layout>
                <BackButton />
                <Card padding="lg" className="text-center">
                    <div className="text-5xl mb-4">🌴</div>
                    <h1 className="text-xl font-bold text-ink">Тур не найден</h1>
                </Card>
            </Layout>
        );
    }

    const images = tour.images ?? [tour.image];
    const completed = Boolean(people && date);

    const handleSubmit = async () => {
        if (!completed) return;

        setLoading(true);
        setError("");

        try {
            await submitLead({
                category: "tours",
                title: `Заявка на тур — ${tour.title}`,
                emoji: "🌴",
                fields: {
                    Тур: tour.title,
                    "Количество человек": people,
                    "Желаемая дата": formatDate(date),
                },
            });

            hapticFeedback("success");
            setSent(true);
        } catch (err) {
            hapticFeedback("error");
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось отправить заявку",
            );
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <Layout>
                <Card padding="lg" className="text-center animate-fade-in-up">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-ink mb-2">
                        Заявка отправлена!
                    </h1>
                    <p className="text-ink-muted mb-6">
                        Мы получили заявку на тур «{tour.title}» и скоро свяжемся с вами в Telegram.
                    </p>
                    <Button onClick={() => window.history.back()}>
                        Вернуться к туру
                    </Button>
                </Card>
            </Layout>
        );
    }

    return (
        <Layout>
            <BackButton />

            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <span className="text-4xl">🌴</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">
                        {tour.title}
                    </h1>
                </div>

                <Card padding="none" className="overflow-hidden mb-5">
                    <div className="relative aspect-[16/10] sm:aspect-[16/8] bg-surface-muted">
                        <img
                            src={images[slide]}
                            alt={`${tour.title} — фото ${slide + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSlide((current) =>
                                            current === 0 ? images.length - 1 : current - 1,
                                        )
                                    }
                                    aria-label="Предыдущее фото"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white backdrop-blur-sm flex items-center justify-center"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSlide((current) =>
                                            current === images.length - 1 ? 0 : current + 1,
                                        )
                                    }
                                    aria-label="Следующее фото"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white backdrop-blur-sm flex items-center justify-center"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSlide(index)}
                                            aria-label={`Фото ${index + 1}`}
                                            className={`h-1.5 rounded-full transition-all ${
                                                index === slide
                                                    ? "w-6 bg-white"
                                                    : "w-1.5 bg-white/60"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                <Card padding="md" className="mb-5">
                    <h2 className="text-lg font-bold text-ink mb-3">О туре</h2>
                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                        {tour.fullDescription}
                    </p>

                    <div className="mt-5">
                        <h3 className="font-semibold text-ink mb-3">Что вас ждёт</h3>
                        <ul className="space-y-2.5">
                            {tour.highlights.map((item) => (
                                <li key={item} className="flex gap-2.5 text-sm text-ink-muted">
                                    <span className="text-brand-600">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>

                <div className="mb-3">
                    <h2 className="text-xl font-bold text-ink">Желаете посетить?</h2>
                    <p className="text-sm text-ink-muted mt-1">
                        Ответьте на несколько вопросов и мы подберём желаемую дату.
                    </p>
                </div>

                <Card className="mb-4 overflow-hidden">
                    <div className="space-y-6">
                        <OptionGroup
                            title="Количество человек"
                            options={[
                                "1 человек",
                                "2 человека",
                                "3 человека",
                                "4+ человека",
                            ]}
                            value={people}
                            onChange={setPeople}
                        />

                        <div className="min-w-0">
                            <h3 className="font-semibold text-ink mb-2 text-sm sm:text-base">
                                Планируемая дата
                            </h3>
                            <p className="text-ink-muted text-xs sm:text-sm mb-2">
                                Выберите желаемую дату поездки в календаре
                            </p>
                            <input
                                type="date"
                                value={date}
                                onChange={(event) => setDate(event.target.value)}
                                className="block w-full max-w-full min-w-0 h-12 box-border px-3 py-2 rounded-xl border-2 border-border bg-surface-muted text-ink text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 appearance-none"
                            />
                        </div>
                    </div>
                </Card>

                {completed && (
                    <Card className="animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-brand-600" />
                            <h2 className="font-semibold text-ink">Проверьте заявку</h2>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between gap-4 text-sm py-2 border-b border-border">
                                <span className="text-ink-muted">Тур</span>
                                <span className="font-medium text-ink text-right">{tour.title}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-sm py-2 border-b border-border">
                                <span className="text-ink-muted">Количество человек</span>
                                <span className="font-medium text-ink text-right">{people}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-sm py-2">
                                <span className="text-ink-muted">Дата</span>
                                <span className="font-medium text-ink text-right">{formatDate(date)}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm leading-relaxed">
                                {error}
                            </div>
                        )}

                        <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
                            Отправить заявку
                        </Button>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
