import type { LeadConfig } from "../types/lead";

export const visaLead: LeadConfig = {
    title: "Визаран",

    emoji: "🛂",
    category: "visarun",

    questions: [
        {
            id: "nationality",
            title: "Гражданство",
            options: [
                "Россия",
                "Беларусь",
                "Казахстан",
                "Другое",
            ],
        },

        {
            id: "visaType",
            title: "Тип визы",
            options: [
                "Новая виза",
                "Продление",
            ],
        },

        {
            id: "duration",
            title: "На какой срок?",
            options: [
                "30 дней",
                "45 дней",
                "90 дней",
            ],
        },

        {
            id: "when",
            title: "Дата окончания визы",
            type: "date",
            description: "Выберите дату окончания действующей визы",
            showWhen: {
                questionId: "visaType",
                value: "Продление",
            },
        },

        {
            id: "people",
            title: "Количество человек",
            options: [
                "1 человек",
                "2 человека",
                "3 человека",
                "4+ человека",
            ],
        },
    ],
};
