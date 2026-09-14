import type { Category } from "../types/category";

// Keep category artwork paths explicit so Vercel deploys the same assets as main.
export const categories: Category[] = [
    {
        id: "transport",
        title: "Авто и байки",
        description: "Аренда автомобилей и мотобайков",
        icon: "🏍️",
        image: "/category-icon/transport.png",
        path: "/transport",
    },
    {
        id: "exchange",
        title: "Обмен",
        description: "Курсы валют и обмен",
        icon: "💵",
        image: "/category-icon/exchange.png",
        path: "/currency",
    },
    {
        id: "housing",
        title: "Жилье",
        description: "Квартиры, дома и виллы в Нячанге",
        icon: "🏠",
        image: "/category-icon/housing.png",
        path: "/housing",
    },
    {
        id: "visarun",
        title: "Визаран",
        description: "Визы и выезды из Вьетнама",
        icon: "🛂",
        image: "/category-icon/visaruns.png",
        path: "/visarun",
    },
    {
        id: "tours",
        title: "Туры",
        description: "Экскурсии и путешествия",
        icon: "🌴",
        image: "/category-icon/tours.png",
        path: "/tours",
    },
    {
        id: "places",
        title: "Места",
        description: "Кафе, пляжи, спорт и клубы",
        icon: "📍",
        image: "/category-icon/places.png",
        path: "/places",
    },
];
