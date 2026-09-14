import { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import PlaceCard from "../components/PlaceCard";
import { places } from "../data/places";

const categoryIcons = {
    food: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA90lEQVR42u3ayxLCMAiF4eDk/V/5uHDTnXEKFOTP0vGWzwNNakzSmjxea/gAAAAAAAAAgMFjO7zHdSVlNx4//YxfX1s6AbrxHE0oAU3uAWGx7wCQMvlOVwGbWALhk68KkHqDgpXg5PiTgIIAogSSwXbn+iUBBQGUnBKrmABVanIZAHY4UVXsEV4J+IYQ9curUgnY01vbCj3AOk0+qglap7UB6wAAACi9/xcJ+CBoEoDRA86X139dAjY5AVwGAQAAgLYAIgEAAAAAAAAAMBYgchfn/u8SR2QSv7g5I7jgdDkgYZf4u6Zirz5j9FFZLoMAAAAAAAAEjDcvVCGLoiz4EQAAAABJRU5ErkJggg==",
    sport: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA9UlEQVR42u3XwRKDIAxFUR/j///y675jh7YmEOSy1DHiMQQi28fOox2bDwAAAAAAAAAAAAAAAABgz3EGxnpvK7VC7JY0wU/XImO7CoD/vHc3dgjyiBrgwc8NBbham0qaa0rsFXcB7Q4QulTarBdzEHoAgMgAAADYqhnyAmvfv9ao9mVQL7j9OToD7lR/T0QQNQAAAACILILdwlKocCoiA1Y98ysyA3Tj74/8UGXXAD2tBrALAAAAAAAAMLgHr/SOVniCuojrahkw+2CkChmgzj0lxp7SDfZ6hejsSM2ys1pKsg0CAAAAAAAAAAAAAAAAAAAAkD9emGwkjPcwxQMAAAAASUVORK5CYII=",
    beaches: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABiklEQVR42u2bSw7DIAxEM4j7X3m6rSI1xcEfSAapmwYKfgwG7BQkjzeXdry8CIAACIAACIAAvLj0hcZyPpHhiQBorIsnAKBTW+wGgEG/h9UBMElRLiBasvH4+lw9TwPdkow/G8YfdazrnasAoGFG/xl/BdEdQgs2/nAyPgxCSzTeWg8Xzg9eECKOwqOzhIB+mAlgVs6zCnHpryUN1mv26VRnGgB/fMeEg5CrCqKuw98gKuLujATAoLolKqiKBzBa2pEAMHBNZaaMp6QTmBqrcIbm3aYXD4jVwHvCrNxtk6Kg1aLCuBkbSHWCR/HadnW6OwCw3AnMQdRKACwAtbQPQEWnyg0KgAAIgAA8ZAvcWgHQEhCAmtKT1jWeCoDGeljJAc4uATq1wY4KGE2KjmZysBMAyyyOhrdYpYaeJGEvEO6OtiWv39E43znHSAM824AG8wIW462zFLkrwEMBnp6bE6q4qyT3bTDqpQXcMHw6dI7gf42Fv+q60lF4qyOwLkMCIAACIAACIAAC8AGejl+aqDOmXwAAAABJRU5ErkJggg==",
    hiking: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABHElEQVR42u2XwQ6DMAxDscX//3J2nbRNrJCmSePcAAHpsx0ozOzoXDyalwAIgAAIgAAIgAAIgAAIQNM6F7zzffeFbg6wi2NFYGcANnh+KwD28Pp2EUCnCNiPxSODCzQEF6mfZhYwcPEpZ0FkBPDnedsBgGkGjFn9ygU2CyoTq29fnmcVHYDMUWIi9bECCpOpHw6BCbMf+r/Aik17Amch9VHJAXC6d/regRPUhxNARMSKia0f0gMTWX/JO1hUfbcdJIupn+YrkCH7Li6g0+JLqu8VAVR2AQta37VHFlbfpQdupv5wr3zwwEyDDxEOyF63BuL5wE5VBiK6OKB9BKYBwEZz4dYMqA5BERAAARAAARAAARAAARAAARCAj3oBrHkyfjh1MIEAAAAASUVORK5CYII=",
    clubs: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABKUlEQVR42u3a0QrCMAyF4Z3i+79yvPFCBNm6Jmm6/gXvdHC+JaEtysyOnVc7Nl8AAAAAAAAAsOayz2dLANu5AswToz3gzWvkga+Fw2vXFnALvxJA2JG17Vr6qwCEhh8Zgla0FfTUGVBuK6ynAHjvAxRU5oraEDXnsBGzISy8xwzwRrgz9TVjBkQg2I3nDrdcC+x973YofxYYQbDOvi97FriDMC181EaoB6EXZ5nDkG6U/e/v3C8/srfC6nyb6eFnnAXsQqC08BkAuoCgr++lhs+qgKtDMT18ZgucIUwJnz0D/iFMCz9jCIYfbqoDnAVMv2iZdSVW5kap0p2gdgc4AAAAAAAAAAAAAAAAAAAAslbG/wRt8HuiAgAAYOkZICoAAAAAAAAAAEquN37nM45E0w4aAAAAAElFTkSuQmCC",
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
                    <span className="text-4xl">📍</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">Куда сходить</h1>
                    <p className="text-ink-muted mt-1 text-sm">Лучшие реальные места Нячанга</p>
                </div>

                <div
                    className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {categories.map((category) => {
                        const isActive = activeTab === category.key;

                        return (
                            <button
                                key={category.key}
                                type="button"
                                onClick={() => setActiveTab(category.key)}
                                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                                    isActive
                                        ? "bg-brand-600 text-white shadow-[var(--shadow-btn)]"
                                        : "bg-white/80 text-ink-muted hover:bg-white hover:text-ink border border-border"
                                }`}
                            >
                                <span className="w-6 h-6 shrink-0 flex items-center justify-center">
                                    <img
                                        src={`data:image/png;base64,${categoryIcons[category.key]}`}
                                        alt=""
                                        aria-hidden="true"
                                        className={`w-6 h-6 object-contain ${isActive ? "" : "brightness-0 opacity-55"}`}
                                    />
                                </span>
                                {category.label}
                            </button>
                        );
                    })}
                </div>

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
