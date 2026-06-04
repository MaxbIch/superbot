import type { Category } from "../types/category";

export const categories: Category[] = [
    {
        id: "transport",
        title: "Байки & Авто",
        description:
            "Аренда байков и автомобилей в Нячанге",
        icon: "🏍️",
        path: "/transport",
    },

    {
        id: "currency",
        title: "Обмен валют",
        description:
            "Актуальные курсы обмена валюты",
        icon: "💵",
        path: "/currency",
    },

    {
        id: "housing",
        title: "Жилье",
        description:
            "Квартиры, дома, виллы и отели",
        icon: "🏠",
        path: "/housing",
    },

    {
        id: "visarun",
        title: "Визараны",
        description:
            "Визы во Вьетнам и выезды в соседние страны",
        icon: "🛂",
        path: "/visarun",
    },

    {
        id: "tours",
        title: "Туры",
        description:
            "Экскурсии, острова и развлечения",
        icon: "🌴",
        path: "/tours",
    },

    {
        id: "places",
        title: "Куда сходить",
        description:
            "Лучшие заведения, спорт, тусовки и пляжи",
        icon: "📍",
        path: "/places",
    },
];