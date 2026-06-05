import type { LeadConfig } from "../types/lead";

export const visaLead: LeadConfig = {
    title: "Визаран",

    emoji: "🛂",

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
                "Продление",
                "Новая виза",
                "Visa Run",
            ],
        },

        {
            id: "duration",
            title: "На какой срок?",
            options: [
                "30 дней",
                "90 дней",
                "180 дней",
            ],
        },

        {
            id: "when",
            title: "Когда нужно?",
            options: [
                "Сегодня",
                "На этой неделе",
                "В течение месяца",
            ],
        },
    ],
};