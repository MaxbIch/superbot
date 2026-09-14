import { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import PlaceCard from "../components/PlaceCard";
import { places } from "../data/places";

const categoryIcons = {
    food: "/category-icons/food.svg",
    sport: "/category-icons/sport.svg",
    beaches: "/category-icons/beaches.svg",
    hiking: "/category-icons/hiking.svg",
    clubs: "/category-icons/clubs.svg",
} as const;

const categories = [
    { key: "food", label: "Еда" },
    { key: "sport", label: "Спорт" },
    { key: "beaches", label: "Пляжи" },
    { key: "hiking", label: "Хайкинг" },
    { key: "clubs", label: "Клубы" },
] as const;

export default function PlacesPage() {
    const [activeTab, setActiveTab] = useState<(typeof categories)[number]["key"]>("food");
    const currentPlaces = places[activeTab] ?? [];

    return (
        <Layout>
            <BackButton />
            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <img src="/category-icon/places.png" alt="" aria-hidden="true" className="w-16 h-16 object-contain" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">Куда сходить</h1>
                    <p className="text-ink-muted mt-1 text-sm">Лучшие реальные места Нячанга</p>
                </div>

                <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {categories.map((category) => {
                        const isActive = activeTab === category.key;
                        return (
                            <button key={category.key} type="button" onClick={() => setActiveTab(category.key)} className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] ${isActive ? "bg-brand-600 text-white shadow-[var(--shadow-btn)]" : "bg-white/80 text-ink-muted hover:bg-white hover:text-ink border border-border"}`}>
                                <img src={categoryIcons[category.key]} alt="" aria-hidden="true" className="w-6 h-6 object-contain" draggable={false} />
                                {category.label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {currentPlaces.map((place) => (
                        <Link key={place.id} to={`/places/${place.id}`} className="block">
                            <PlaceCard title={place.title} image={place.image} description={place.short} onOpen={() => undefined} />
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
