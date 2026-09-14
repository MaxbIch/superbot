import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import CategoryCard from "../components/CategoryCard";
import Card from "../components/Card";

import { categories } from "../data/categories";

const features = [
    {
        icon: "🛡️",
        title: "Надёжно",
        text: "Проверенные партнёры",
    },
    {
        icon: "⚡",
        title: "Быстро",
        text: "Ответ за несколько минут",
    },
    {
        icon: "⭐",
        title: "Опыт",
        text: "1000+ довольных клиентов",
    },
];

export default function HomePage() {
    return (
        <Layout>
            <Card
                padding="none"
                className="mb-5 animate-fade-in-up overflow-hidden relative h-[56vh] min-h-[320px] max-h-[560px] sm:h-[430px] sm:min-h-0 sm:max-h-none"
            >
                <img
                    src="/hero-mobile.webp"
                    alt="Нячанг — Super Bot"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
            </Card>

            <h3 className="font-bold text-ink mb-3 px-1">
                Выберите раздел
            </h3>

            <div className="grid gap-3 sm:gap-4 mb-6">
                {categories.map((item, index) => (
                    <div
                        key={item.id}
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <CategoryCard {...item} />
                    </div>
                ))}
            </div>

            <Card padding="md" className="mb-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {features.map((item) => (
                        <div key={item.title} className="text-center">
                            <div className="text-2xl sm:text-3xl mb-2">
                                {item.icon}
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-ink">
                                {item.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>

            <Link to="/reviews" className="block animate-fade-in-up">
                <Card hover padding="md" className="group mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-3xl">
                            ⭐
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-ink text-base sm:text-lg">
                                Отзывы клиентов
                            </h3>
                            <p className="text-sm text-ink-muted mt-0.5">
                                Узнайте, что говорят о Super Bot Nha Trang
                            </p>
                        </div>
                        <span className="text-xl text-brand-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all">
                            →
                        </span>
                    </div>
                </Card>
            </Link>
        </Layout>
    );
}
