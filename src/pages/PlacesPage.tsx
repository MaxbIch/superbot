import { useState } from "react";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Tabs from "../components/Tabs";
import PlaceCard from "../components/PlaceCard";
import Modal from "../components/Modal";

import { places } from "../data/places";

const categories = [
    {
        key: "food",
        label: "Еда",
    },
    {
        key: "sport",
        label: "Спорт",
    },
    {
        key: "beaches",
        label: "Пляжи",
    },
    {
        key: "hiking",
        label: "Хайкинг",
    },
    {
        key: "clubs",
        label: "Клубы",
    },
];

export default function PlacesPage() {
    const [activeTab, setActiveTab] =
        useState("food");

    const [selectedPlace, setSelectedPlace] =
        useState<any>(null);

    const currentPlaces =
        places[
            activeTab as keyof typeof places
            ] || [];

    const activeLabel =
        categories.find(
            (item) => item.key === activeTab
        )?.label || "Еда";

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <BackButton />

                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Куда сходить
                    </h1>

                    <p className="text-gray-700 mt-2">
                        Лучшие места Нячанга
                    </p>
                </div>

                <Tabs
                    tabs={categories.map(
                        (item) => item.label
                    )}
                    active={activeLabel}
                    onChange={(label) => {
                        const category =
                            categories.find(
                                (item) =>
                                    item.label === label
                            );

                        if (category) {
                            setActiveTab(category.key);
                        }
                    }}
                />

                {currentPlaces.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center">
                        <h3 className="font-semibold">
                            Скоро добавим места в эту
                            категорию 👌
                        </h3>
                    </div>
                ) : (
                    <div
                        className="
              grid
              gap-6
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
            "
                    >
                        {currentPlaces.map(
                            (place: any) => (
                                <PlaceCard
                                    key={place.id}
                                    title={place.title}
                                    image={place.image}
                                    description={
                                        place.short
                                    }
                                    onOpen={() =>
                                        setSelectedPlace(place)
                                    }
                                />
                            )
                        )}
                    </div>
                )}

                <Modal
                    open={!!selectedPlace}
                    onClose={() =>
                        setSelectedPlace(null)
                    }
                    title={
                        selectedPlace?.title || ""
                    }
                >
                    {selectedPlace && (
                        <>
                            <img
                                src={selectedPlace.image}
                                alt={selectedPlace.title}
                                className="
                  w-full
                  h-64
                  object-cover
                  rounded-2xl
                  mb-4
                "
                            />

                            <p className="text-gray-700 mb-6">
                                {
                                    selectedPlace.description
                                }
                            </p>

                            <a
                                href={
                                    selectedPlace.maps
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                  block
                  w-full
                  text-center
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  font-semibold
                  py-3
                  rounded-2xl
                  transition
                "
                            >
                                📍 Открыть маршрут
                            </a>
                        </>
                    )}
                </Modal>
            </div>
        </Layout>
    );
}