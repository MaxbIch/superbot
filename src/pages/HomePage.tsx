import Layout from "../components/Layout";
import CategoryCard from "../components/CategoryCard";
import Card from "../components/Card";
import ContactButton from "../components/ContactButton";

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
                padding="lg"
                className="mb-6 animate-fade-in-up overflow-hidden relative"
            >
                <div
                    className="
                        absolute -top-10 -right-10 w-40 h-40
                        bg-brand-200/40 rounded-full blur-2xl
                    "
                />

                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-1 text-center sm:text-left">
                        <p className="text-brand-600 font-semibold text-sm mb-1">
                            Добро пожаловать
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-1">
                            👋 Привет!
                        </h1>
                        <h2 className="text-xl sm:text-2xl font-bold text-brand-800 mb-3">
                            Я супер бот Нячанга
                        </h2>
                        <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
                            Помогу с арендой, турами, обменом валют,
                            визаранами и жильём во Вьетнаме.
                        </p>
                    </div>

                    <div
                        className="
                            w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0
                            rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600
                            flex items-center justify-center text-6xl
                            shadow-[var(--shadow-btn)]
                        "
                    >
                        🌴
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

            <ContactButton />
        </Layout>
    );
}
