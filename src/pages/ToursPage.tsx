import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import TourCard from "../components/TourCard";
import { tours } from "../data/tours";

export default function ToursPage() {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <BackButton />

                <h1 className="text-3xl font-bold mb-6">
                    Туры по Вьетнаму
                </h1>

                <div
                    className="
            grid
            gap-6
            md:grid-cols-2
          "
                >
                    {tours.map((tour) => (
                        <TourCard
                            key={tour.id}
                            {...tour}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}