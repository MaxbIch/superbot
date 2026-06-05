import type {
    LeadConfig,
} from "../types/lead";

export const bikeLead: LeadConfig =
    {
        title:
            "Аренда байка",

        emoji: "🏍️",

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