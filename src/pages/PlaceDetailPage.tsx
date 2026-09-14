import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, X } from "lucide-react";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Card from "../components/Card";
import Button from "../components/Button";
import { places } from "../data/places";

export default function PlaceDetailPage() {
    const { id } = useParams();
    const place = Object.values(places).flat().find((item) => item.id === id);
    const [slide, setSlide] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const images = place?.images ?? (place ? [place.image] : []);

    useEffect(() => {
        if (!fullscreen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setFullscreen(false);
            if (event.key === "ArrowLeft" && images.length > 1) setSlide((current) => current === 0 ? images.length - 1 : current - 1);
            if (event.key === "ArrowRight" && images.length > 1) setSlide((current) => current === images.length - 1 ? 0 : current + 1);
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [fullscreen, images.length]);

    if (!place) {
        return <Layout><BackButton /><Card padding="lg" className="text-center"><div className="text-5xl mb-4">📍</div><h1 className="text-xl font-bold text-ink">Место не найдено</h1></Card></Layout>;
    }

    const previousSlide = () => setSlide((current) => current === 0 ? images.length - 1 : current - 1);
    const nextSlide = () => setSlide((current) => current === images.length - 1 ? 0 : current + 1);

    return (
        <Layout>
            <BackButton />
            {fullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" onClick={() => setFullscreen(false)}>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setFullscreen(false); }} aria-label="Закрыть" className="absolute right-4 top-4 z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>
                    {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); previousSlide(); }} aria-label="Предыдущее фото" className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"><ChevronLeft className="w-6 h-6" /></button>}
                    <img src={images[slide]} alt={`${place.title} — фото ${slide + 1}`} className="max-w-full max-h-full w-auto h-auto object-contain select-none" onClick={(event) => event.stopPropagation()} />
                    {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); nextSlide(); }} aria-label="Следующее фото" className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"><ChevronRight className="w-6 h-6" /></button>}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 text-white text-sm px-3 py-1.5">{slide + 1} / {images.length}</div>
                </div>
            )}

            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <span className="text-4xl">📍</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">{place.title}</h1>
                    <p className="text-ink-muted text-sm mt-1">{place.address}</p>
                </div>

                <Card padding="none" className="overflow-hidden mb-5">
                    <div className="relative w-full aspect-[16/9] bg-surface-muted overflow-hidden">
                        <img src={images[slide]} alt={`${place.title} — фото ${slide + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                        <button type="button" onClick={() => setFullscreen(true)} className="absolute inset-0 w-full h-full cursor-zoom-in" aria-label="Открыть фото на весь экран" />
                        {images.length > 1 && (
                            <>
                                <button type="button" onClick={(event) => { event.stopPropagation(); previousSlide(); }} aria-label="Предыдущее фото" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/35 text-white backdrop-blur-sm flex items-center justify-center"><ChevronLeft className="w-5 h-5" /></button>
                                <button type="button" onClick={(event) => { event.stopPropagation(); nextSlide(); }} aria-label="Следующее фото" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/35 text-white backdrop-blur-sm flex items-center justify-center"><ChevronRight className="w-5 h-5" /></button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">{images.map((_, index) => <span key={index} className={`h-1.5 rounded-full ${index === slide ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />)}</div>
                            </>
                        )}
                    </div>
                </Card>

                <Card padding="md" className="mb-5">
                    <h2 className="text-lg font-bold text-ink mb-3">О месте</h2>
                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{place.description}</p>
                    <div className="mt-5"><h3 className="font-semibold text-ink mb-3">Почему стоит сходить</h3><ul className="space-y-2.5">{place.highlights.map((item) => <li key={item} className="flex gap-2.5 text-sm text-ink-muted"><span className="text-brand-600">✓</span><span>{item}</span></li>)}</ul></div>
                </Card>

                {!!place.socials?.length && <Card padding="md" className="mb-5"><h2 className="text-lg font-bold text-ink mb-3">Социальные сети</h2><div className="flex flex-wrap gap-2">{place.socials.map((social) => <a key={social.url} href={social.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition"><ExternalLink className="w-4 h-4" />{social.label}</a>)}</div></Card>}
                <Button fullWidth size="lg" icon={<MapPin className="w-5 h-5" />} onClick={() => window.open(place.maps, "_blank")}>Открыть маршрут</Button>
            </div>
        </Layout>
    );
}
