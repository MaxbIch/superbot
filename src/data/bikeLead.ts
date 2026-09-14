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
                    "Какой объём двигателя вам подходит?",

                options: [
                    "До 50 см³",
                    "50–100 см³",
                    "100–300 см³",
                    "300+ см³",
                ],
            },

            {
                id: "license",
                title:
                    "Какое водительское удостоверение у вас есть?",

                options: [
                    "ВУ",
                    "МВУ",
                    "Нет прав",
                ],
            },

            {
                id: "term",
                title:
                    "На какой срок планируете аренду?",

                options: [
                    "1 день",
                    "Неделя",
                    "Месяц",
                    "3+ месяца",
                ],
            },
        ],
    };
