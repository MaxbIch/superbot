import Layout from "../components/Layout";
import CategoryCard from "../components/CategoryCard";

import { categories } from "../data/categories";

export default function HomePage() {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto">

                <div
                    className="
            bg-white
            rounded-[32px]
            p-6
            md:p-10
            mb-8
          "
                >
                    <div
                        className="
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-8
            "
                    >
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                👋 Привет!
                            </h1>

                            <h2 className="text-2xl font-semibold mb-4">
                                Я супер бот Нячанга
                            </h2>

                            <p className="text-gray-600 max-w-xl">
                                Помогу вам с арендой,
                                турами, обменом валют,
                                визаранами и жильём
                                во Вьетнаме.
                            </p>
                        </div>

                        <div
                            className="
                w-48
                h-48
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                text-7xl
              "
                        >
                            🌴
                        </div>
                    </div>
                </div>

                <h3 className="font-semibold text-lg mb-4">
                    Выберите нужный раздел 👇
                </h3>

                <div
                    className="
            grid
            gap-4
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
          "
                >
                    {categories.map((item) => (
                        <CategoryCard
                            key={item.id}
                            {...item}
                        />
                    ))}
                </div>

                <div
                    className="
            mt-8
            bg-white
            rounded-[32px]
            p-6
          "
                >
                    <div
                        className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
              text-center
            "
                    >
                        <div>
                            <div className="text-4xl mb-3">
                                🛡️
                            </div>

                            <h4 className="font-bold">
                                Надежно
                            </h4>

                            <p className="text-gray-500">
                                Проверенные услуги
                            </p>
                        </div>

                        <div>
                            <div className="text-4xl mb-3">
                                ⚡
                            </div>

                            <h4 className="font-bold">
                                Быстро
                            </h4>

                            <p className="text-gray-500">
                                Мгновенные ответы
                            </p>
                        </div>

                        <div>
                            <div className="text-4xl mb-3">
                                ⭐
                            </div>

                            <h4 className="font-bold">
                                Опыт
                            </h4>

                            <p className="text-gray-500">
                                1000+ клиентов
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
}