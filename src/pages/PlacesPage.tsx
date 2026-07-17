import { useState } from "react";
import { MapPin, X } from "lucide-react";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Tabs from "../components/Tabs";
import PlaceCard from "../components/PlaceCard";
import Button from "../components/Button";

import { places } from "../data/places";

const categories = [
    { key: "food", label: "Еда" },
    { key: "sport", label: "Спорт" },
    { key: "beaches", label: "Пляжи" },
    { key: "hiking", label: "Хайкинг" },
    { key: "clubs", label: "Клубы" },
];

interface Place {
    id: number;
    title: string;
    image: string;
    short: string;
    description: string;
    maps: string;
}

export default function PlacesPage() {
    const [activeTab, setActiveTab] = useState("food");
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    const currentPlaces =
        (places[activeTab as keyof typeof places] as Place[]) || [];

    const activeLabel =
        categories.find((item) => item.key === activeTab)?.label || "Еда";

    return (
        <Layout>
            <BackButton />

            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <span className="text-4xl">📍</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">
                        Куда сходить
                    </h1>
                    <p className="text-ink-muted mt-1 text-sm">
                        Лучшие места Нячанга
                    </p>
                </div>

                <Tabs
                    tabs={categories.map((item) => item.label)}
                    active={activeLabel}
                    onChange={(label) => {
                        const category = categories.find(
                            (item) => item.label === label,
                        );
                        if (category) setActiveTab(category.key);
                    }}
                />

                {currentPlaces.length === 0 ? (
                    <div className="bg-white rounded-[var(--radius-card)] p-8 text-center shadow-[var(--shadow-card)]">
                        <div className="text-4xl mb-3">🔜</div>
                        <h3 className="font-semibold text-ink">
                            Скоро добавим места в эту категорию
                        </h3>
                        <p className="text-ink-muted text-sm mt-1">
                            Следите за обновлениями
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {currentPlaces.map((place) => (
                            <PlaceCard
                                key={place.id}
                                title={place.title}
                                image={place.image}
                                description={place.short}
                                onOpen={() => setSelectedPlace(place)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedPlace && (
                <div
                    className="
                        fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
                        flex items-end sm:items-center justify-center p-0 sm:p-4
                    "
                    onClick={() => setSelectedPlace(null)}
                >
                    <div
                        className="
                            bg-white w-full sm:max-w-lg
                            rounded-t-3xl sm:rounded-[var(--radius-card)]
                            max-h-[90dvh] overflow-auto
                            animate-fade-in-up safe-bottom
                        "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <img
                                src={selectedPlace.image}
                                alt={selectedPlace.title}
                                className="w-full h-52 sm:h-64 object-cover"
                            />
                            <button
                                onClick={() => setSelectedPlace(null)}
                                className="
                                    absolute top-3 right-3 w-9 h-9
                                    bg-black/40 backdrop-blur-sm rounded-full
                                    flex items-center justify-center text-white
                                    hover:bg-black/60 transition
                                "
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6">
                            <h2 className="font-bold text-xl text-ink mb-2">
                                {selectedPlace.title}
                            </h2>
                            <p className="text-ink-muted text-sm leading-relaxed mb-5">
                                {selectedPlace.description}
                            </p>

                            <Button
                                fullWidth
                                size="lg"
                                icon={<MapPin className="w-5 h-5" />}
                                onClick={() =>
                                    window.open(selectedPlace.maps, "_blank")
                                }
                            >
                                Открыть маршрут
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
