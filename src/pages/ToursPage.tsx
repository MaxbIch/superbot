import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import TourCard from "../components/TourCard";
import { tours } from "../data/tours";

export default function ToursPage() {
    return (
        <Layout>
            <BackButton />

            <div className="mb-5 animate-fade-in-up">
                <span className="text-4xl">🌴</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">
                    Туры по Вьетнаму
                </h1>
                <p className="text-ink-muted mt-1 text-sm">
                    Экскурсии, острова и развлечения
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {tours.map((tour) => (
                    <TourCard key={tour.id} {...tour} />
                ))}
            </div>
        </Layout>
    );
}
