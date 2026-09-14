import type { Category } from "../types/category";

export const categories: Category[] = [
    {
        id: "auto",
        title: "Авто",
        description: "Аренда автомобилей в Нячанге",
        icon: "🚗",
        image: "/category-icons/auto.svg",
        path: "/transport?type=car",
    },
    {
        id: "bikes",
        title: "Байки",
        description: "Аренда мотобайков в Нячанге",
        icon: "🏍️",
        image: "/category-icons/bikes.svg",
        path: "/transport?type=bike",
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
