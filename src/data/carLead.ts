import type {
    LeadConfig,
} from "../types/lead";

export const carLead: LeadConfig =
    {
        title:
            "Аренда автомобиля",

        emoji: "🚗",
        category: "transport/car",

        questions: [
            {
                id: "seats",
                title:
                    "Сколько мест вам нужно?",

                options: [
                    "2 места",
                    "4 места",
                    "5 мест",
                    "7+ мест",
                ],
            },

            {
                id: "engine",
                title:
                    "Какой тип двигателя предпочитаете?",

                options: [
                    "Электромобиль",
                    "ДВС",
                    "Не важно",
                ],
            },

            {
                id: "budget",
                title:
                    "Какой бюджет на аренду?",

                options: [
                    "До 1 000 000 ₫",
                    "1 000 000–2 000 000 ₫",
                    "От 2 000 000 ₫",
                ],
            },
        ],
    };
