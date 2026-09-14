import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import LeadFormPage from "../components/LeadFormPage";
import Card from "../components/Card";

import { bikeLead } from "../data/bikeLead";
import { carLead } from "../data/carLead";

const options = [
    {
        type: "bike" as const,
        image: "/category-icons/bikes.svg",
        title: "Аренда байка",
        description: "Vision, Airblade, NVX, PCX и другие",
    },
    {
        type: "car" as const,
        image: "/category-icons/auto.svg",
        title: "Аренда автомобиля",
        description: "Седан, кроссовер или минивэн",
    },
];

export default function TransportPage() {
    const [searchParams] = useSearchParams();
    const requestedType = searchParams.get("type");
    const initialType = requestedType === "bike" || requestedType === "car" ? requestedType : null;
    const [type, setType] = useState<"bike" | "car" | null>(initialType);

    if (type === "bike") return <LeadFormPage config={bikeLead} />;
    if (type === "car") return <LeadFormPage config={carLead} />;

    return (
        <Layout>
            <BackButton />
            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <img src="/category-icons/transport.svg" alt="" aria-hidden="true" className="w-16 h-16 object-contain" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">Авто и байки</h1>
                    <p className="text-ink-muted mt-1 text-sm">Выберите тип транспорта</p>
                </div>

                <div className="space-y-3">
                    {options.map((option) => (
                        <Card key={option.type} hover padding="md" onClick={() => setType(option.type)}>
                            <div className="flex items-center gap-4">
                                <img src={option.image} alt="" aria-hidden="true" className="w-16 h-16 object-contain rounded-2xl" />
                                <div className="min-w-0">
                                    <div className="font-bold text-ink">{option.title}</div>
                                    <p className="text-sm text-ink-muted mt-0.5">{option.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
