import type {
    LeadConfig,
} from "../types/lead";

export const bikeLead: LeadConfig =
    {
        title:
            "Аренда байка",

        emoji: "🏍️",
        category: "transport/bike",

        questions: [
            {
                id: "bike",
                title:
                    "Какой байк нужен?",

                options: [
                    "Vision",
                    "Airblade",
                    "NVX",
                    "PCX",
                    "Не важно",
                ],
            },

            {
                id: "engine",
                title:
                    "Какая мощность нужна?",

                options: [
                    "До 50 кубов",
                    "50–100 кубов",
                    "100–300 кубов",
                    "300+ кубов",
                ],
            },

            {
                id: "license",
                title:
                    "Есть ли у вас права?",

                options: [
                    "Пластик",
                    "Международные",
                    "Нет прав",
                ],
            },

            {
                id: "term",
                title:
                    "Срок аренды",

                options: [
                    "1 день",
                    "Неделя",
                    "Месяц",
                    "3+ месяца",
                ],
            },
        ],
    };