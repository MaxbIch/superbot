export interface Review {
    id: string;
    username: string;
    text: string;
    rating: number;
    date?: string;
}

// Отзывы будут поступать сюда автоматически после подключения Telegram-группы.
// Пока не добавляем выдуманные отзывы.
export const reviews: Review[] = [];
