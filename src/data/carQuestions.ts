import type { FormQuestion } from "../types/form";

export const carQuestions: FormQuestion[] = [
    {
        id: "carType",
        title: "Тип автомобиля",
        options: [
            "Седан",
            "Кроссовер",
            "Минивэн",
            "Не важно",
        ],
    },

    {
        id: "gearbox",
        title: "Коробка передач",
        options: [
            "Автомат",
            "Механика",
            "Не важно",
        ],
    },

    {
        id: "period",
        title: "Срок аренды",
        options: [
            "1 день",
            "3 дня",
            "Неделя",
            "Месяц",
        ],
    },
];