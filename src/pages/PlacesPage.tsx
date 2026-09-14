import { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Tabs from "../components/Tabs";
import PlaceCard from "../components/PlaceCard";
import { places } from "../data/places";

const categories = [
    { key: "food", label: "Еда" },
    { key: "sport", label: "Спорт" },
    { key: "beaches", label: "Пляжи" },
    { key: "hiking", label: "Хайкинг" },
    { key: "clubs", label: "Клубы" },
];

export default function PlacesPage() {
    const [activeTab, setActiveTab] = useState("food");

    const currentPlaces = places[activeTab] ?? [];
    const activeLabel = categories.find((item) => item.key === activeTab)?.label || "Еда";

    return (
        <Layout>
            <BackButton />

            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <span className="text-4xl">📍</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">Куда сходить</h1>
                    <p className="text-ink-muted mt-1 text-sm">Лучшие реальные места Нячанга</p>
                </div>

                <Tabs
                    tabs={categories.map((item) => item.label)}
                    active={activeLabel}
                    onChange={(label) => {
                        const category = categories.find((item) => item.label === label);
                        if (category) setActiveTab(category.key);
                    }}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    {currentPlaces.map((place) => (
                        <Link key={place.id} to={`/places/${place.id}`} className="block">
                            <PlaceCard
                                title={place.title}
                                image={place.image}
                                description={place.short}
                                onOpen={() => undefined}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
