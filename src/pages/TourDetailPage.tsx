import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2, X } from "lucide-react";

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
    const [fullscreen, setFullscreen] = useState(false);
    const [people, setPeople] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const images = tour?.images ?? (tour ? [tour.image] : []);

    useEffect(() => {
        if (!fullscreen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setFullscreen(false);
            if (event.key === "ArrowLeft" && images.length > 1) {
                setSlide((current) => (current === 0 ? images.length - 1 : current - 1));
            }
            if (event.key === "ArrowRight" && images.length > 1) {
                setSlide((current) => (current === images.length - 1 ? 0 : current + 1));
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [fullscreen, images.length]);

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

    const completed = Boolean(people && date);

    const previousSlide = () =>
        setSlide((current) => (current === 0 ? images.length - 1 : current - 1));

    const nextSlide = () =>
        setSlide((current) => (current === images.length - 1 ? 0 : current + 1));

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
            setError(err instanceof Error ? err.message : "Не удалось отправить заявку");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <Layout>
                <Card padding="lg" className="text-center animate-fade-in-up">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-ink mb-2">Заявка отправлена!</h1>
                    <p className="text-ink-muted mb-6">Мы получили заявку на тур «{tour.title}» и скоро свяжемся с вами в Telegram.</p>
                    <Button onClick={() => window.history.back()}>Вернуться к туру</Button>
                </Card>
            </Layout>
        );
    }

    return (
        <Layout>
            <BackButton />

            {fullscreen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-3 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Фото ${slide + 1} из ${images.length}`}
                    onClick={() => setFullscreen(false)}
                >
                    <button type="button" onClick={(event) => { event.stopPropagation(); setFullscreen(false); }} aria-label="Закрыть полноэкранный просмотр" className="absolute right-4 top-4 z-10 w-11 h-11 rounded-full bg-white/10 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
                        <X className="w-6 h-6" />
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); previousSlide(); }} aria-label="Предыдущее фото" className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <img src={images[slide]} alt={`${tour.title} — фото ${slide + 1}`} className="max-w-full max-h-full w-auto h-auto object-contain select-none" onClick={(event) => event.stopPropagation()} />
                    <button type="button" onClick={(event) => { event.stopPropagation(); nextSlide(); }} aria-label="Следующее фото" className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 text-white text-sm px-3 py-1.5 backdrop-blur-sm">{slide + 1} / {images.length}</div>
                </div>
            )}

            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <span className="text-4xl">🌴</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">{tour.title}</h1>
                </div>

                <Card padding="none" className="overflow-hidden mb-5">
                    <button type="button" onClick={() => setFullscreen(true)} className="relative block w-full aspect-[16/10] sm:aspect-[16/8] bg-surface-muted cursor-zoom-in" aria-label="Открыть фотографии на весь экран">
                        <img src={images[slide]} alt={`${tour.title} — фото ${slide + 1}`} className="absolute inset-0 w-full h-full object-contain" />
                        <span className="absolute top-3 right-3 rounded-full bg-black/45 text-white text-xs px-2.5 py-1.5 backdrop-blur-sm">Нажмите для увеличения</span>
                        {images.length > 1 && (
                            <>
                                <span role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); previousSlide(); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); previousSlide(); } }} aria-label="Предыдущее фото" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white backdrop-blur-sm flex items-center justify-center">
                                    <ChevronLeft className="w-5 h-5" />
                                </span>
                                <span role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); nextSlide(); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); nextSlide(); } }} aria-label="Следующее фото" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white backdrop-blur-sm flex items-center justify-center">
                                    <ChevronRight className="w-5 h-5" />
                                </span>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
                                    {images.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === slide ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />)}
                                </div>
                            </>
                        )}
                    </button>
                </Card>

                <Card padding="md" className="mb-5">
                    <h2 className="text-lg font-bold text-ink mb-3">О туре</h2>
                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{tour.fullDescription}</p>

                    {tour.facts && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
                            {tour.facts.map(([label, value]) => (
                                <div key={label} className="rounded-xl bg-surface-muted border border-border px-3 py-2.5">
                                    <div className="text-xs text-ink-muted">{label}</div>
                                    <div className="text-sm font-semibold text-ink mt-0.5">{value}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-5">
                        <h3 className="font-semibold text-ink mb-3">Что вас ждёт</h3>
                        <ul className="space-y-2.5">
                            {tour.highlights.map((item) => <li key={item} className="flex gap-2.5 text-sm text-ink-muted"><span className="text-brand-600">✓</span><span>{item}</span></li>)}
                        </ul>
                    </div>

                    {tour.tips && (
                        <div className="mt-5 rounded-xl bg-brand-50 border border-brand-100 p-3.5">
                            <h3 className="font-semibold text-ink mb-2">Полезно знать</h3>
                            <ul className="space-y-2">{tour.tips.map((tip) => <li key={tip} className="text-sm text-ink-muted leading-relaxed">• {tip}</li>)}</ul>
                        </div>
                    )}

                    {tour.photoSources && (
                        <div className="mt-4 text-xs text-ink-muted">Фото из открытых источников: {" "}{tour.photoSources.map((source, index) => <span key={source}><a href={source} target="_blank" rel="noreferrer" className="underline underline-offset-2">источник {index + 1}</a>{index < tour.photoSources.length - 1 ? ", " : ""}</span>)}</div>
                    )}
                </Card>

                <div className="mb-3">
                    <h2 className="text-xl font-bold text-ink">Желаете посетить?</h2>
                    <p className="text-sm text-ink-muted mt-1">Ответьте на несколько вопросов и мы подберём желаемую дату.</p>
                </div>

                <Card className="mb-4 overflow-hidden">
                    <div className="space-y-6">
                        <OptionGroup title="Количество человек" options={["1 человек", "2 человека", "3 человека", "4+ человека"]} value={people} onChange={setPeople} />
                        <div className="min-w-0">
                            <h3 className="font-semibold text-ink mb-2 text-sm sm:text-base">Планируемая дата</h3>
                            <p className="text-ink-muted text-xs sm:text-sm mb-2">Выберите желаемую дату поездки в календаре</p>
                            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="block w-full max-w-full min-w-0 h-12 box-border px-3 py-2 rounded-xl border-2 border-border bg-surface-muted text-ink text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 appearance-none" />
                        </div>
                    </div>
                </Card>

                {completed && (
                    <Card className="animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-brand-600" /><h2 className="font-semibold text-ink">Проверьте заявку</h2></div>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between gap-4 text-sm py-2 border-b border-border"><span className="text-ink-muted">Тур</span><span className="font-medium text-ink text-right">{tour.title}</span></div>
                            <div className="flex justify-between gap-4 text-sm py-2 border-b border-border"><span className="text-ink-muted">Количество человек</span><span className="font-medium text-ink text-right">{people}</span></div>
                            <div className="flex justify-between gap-4 text-sm py-2"><span className="text-ink-muted">Дата</span><span className="font-medium text-ink text-right">{formatDate(date)}</span></div>
                        </div>
                        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm leading-relaxed">{error}</div>}
                        <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>Отправить заявку</Button>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
