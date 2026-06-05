import type {
    LeadConfig,
} from "../types/lead";

export const carLead: LeadConfig =
    {
        title:
            "Аренда автомобиля",

        emoji: "🚗",

        questions: [
            {
                id: "type",
                title:
                    "Тип автомобиля",

                options: [
                    "Седан",
                    "Кроссовер",
                    "Минивэн",
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
                ],
            },
        ],
    };