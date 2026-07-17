import type {
    LeadConfig,
} from "../types/lead";

export const housingLead: LeadConfig =
    {
        title: "Подбор жилья",

        emoji: "🏠",
        category: "housing",

        questions: [
            {
                id: "type",
                title:
                    "Тип жилья",

                options: [
                    "Студия",
                    "1 спальня",
                    "2 спальни",
                    "3 спальни",
                    "Вилла",
                ],
            },

            {
                id: "district",
                title:
                    "Район",

                options: [
                    "Центр",
                    "Север",
                    "Юг",
                    "Не важно",
                ],
            },

            {
                id: "budget",
                title:
                    "Бюджет",

                options: [
                    "до 10 млн",
                    "10-15 млн",
                    "15-20 млн",
                    "20+ млн",
                ],
            },

            {
                id: "term",
                title:
                    "Срок аренды",

                options: [
                    "До месяца",
                    "1-3 месяца",
                    "3-6 месяцев",
                    "6+ месяцев",
                ],
            },
        ],
    };