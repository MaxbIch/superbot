import type { Category } from "../types/category";

export const categories: Category[] = [
    {
        id: "housing",
        title: "Жилье",
        description: "Квартиры, дома и виллы в Нячанге",
        icon: "🏠",
        image: "/category-icons/housing.svg",
        path: "/housing",
    },
    {
        id: "transport",
        title: "Байки & Авто",
        description: "Аренда мотобайков и автомобилей",
        icon: "🏍️",
        image: "/category-icons/auto.svg",
        path: "/transport",
    },
    {
        id: "exchange",
        title: "Обмен",
        description: "Курсы валют и обмен",
        icon: "💵",
        image: "/category-icons/exchange.svg",
        path: "/currency",
    },
    {
        id: "visarun",
        title: "Визараны",
        description: "Визы и выезды из Вьетнама",
        icon: "🛂",
        image: "/category-icons/visaruns.svg",
        path: "/visarun",
    },
    {
        id: "places",
        title: "Места",
        description: "Кафе, пляжи, спорт и клубы",
        icon: "📍",
        image: "/category-icons/places.svg",
        path: "/places",
    },
    {
        id: "tours",
        title: "Туры",
        description: "Экскурсии и путешествия",
        icon: "🌴",
        image: "/category-icons/tours.svg",
        path: "/tours",
    },
];
