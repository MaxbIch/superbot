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
                className="mb-6 animate-fade-in-up overflow-hidden relative min-h-[350px] sm:min-h-[380px]"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center sm:bg-[position:62%_center]"
                    style={{ backgroundImage: "url('/hero-nha-trang.svg')" }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/72 to-transparent sm:from-white/92 sm:via-white/58 sm:to-transparent" />

                <div className="relative z-10 flex min-h-[350px] sm:min-h-[380px] items-center p-6 sm:p-8 lg:p-10">
                    <div className="max-w-[78%] sm:max-w-[58%] lg:max-w-[54%] text-left">
                        <p className="text-brand-600 font-semibold text-sm mb-1">
                            Добро пожаловать
                        </p>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink mb-1 tracking-tight">
                            👋 Привет!
                        </h1>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-800 mb-3">
                            Я супер бот Нячанга
                        </h2>
                        <p className="text-ink-muted text-sm sm:text-base lg:text-lg leading-relaxed">
                            Помогу с арендой, турами, обменом валют,
                            визаранами и жильём во Вьетнаме.
                        </p>
                    </div>
                </div>
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
