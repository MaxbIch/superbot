import type { FormQuestion } from "../types/form";

export const bikeForm: FormQuestion[] = [
    {
        id: "duration",
        title: "На какой срок нужен байк?",
        options: [
            "1 день",
            "Неделя",
            "Месяц",
        ],
    },

    {
        id: "bikeType",
        title: "Какой тип байка вас интересует?",
        options: [
            "До 50cc",
            "50-125cc",
            "125-165cc",
            "250cc+",
        ],
    },

    {
        id: "people",
        title: "Сколько человек будет ездить?",
        options: [
            "Один",
            "Двое",
        ],
    },

    {
        id: "documents",
        title: "Какие документы есть?",
        options: [
            "Права своей страны",
            "Международные права",
            "Нет прав",
        ],
    },
];