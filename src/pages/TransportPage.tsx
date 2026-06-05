import { useState } from "react";

import LeadFormPage from "../components/LeadFormPage";

import { bikeLead } from "../data/bikeLead";
import { carLead } from "../data/carLead";

export default function TransportPage() {
    const [type, setType] =
        useState<
            "bike" | "car" | null
        >(null);

    if (type === "bike") {
        return (
            <LeadFormPage
                config={bikeLead}
            />
        );
    }

    if (type === "car") {
        return (
            <LeadFormPage
                config={carLead}
            />
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <div className="bg-white rounded-3xl p-6 shadow">

                <h1 className="text-2xl font-bold mb-6">
                    🚘 Транспорт
                </h1>

                <p className="text-gray-500 mb-6">
                    Что вас интересует?
                </p>

                <div className="space-y-4">

                    <button
                        onClick={() =>
                            setType("bike")
                        }
                        className="
              w-full
              bg-white
              border
              rounded-2xl
              p-5
              text-left
              hover:border-green-500
            "
                    >
                        <div className="text-3xl mb-2">
                            🏍️
                        </div>

                        <div className="font-semibold">
                            Аренда байка
                        </div>
                    </button>

                    <button
                        onClick={() =>
                            setType("car")
                        }
                        className="
              w-full
              bg-white
              border
              rounded-2xl
              p-5
              text-left
              hover:border-green-500
            "
                    >
                        <div className="text-3xl mb-2">
                            🚗
                        </div>

                        <div className="font-semibold">
                            Аренда автомобиля
                        </div>
                    </button>

                </div>

            </div>
        </div>
    );
}