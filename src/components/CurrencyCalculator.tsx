import { useEffect, useMemo, useState } from "react";

import { getRates } from "../services/currencyService";

type Currency =
    | "RUB"
    | "USD"
    | "EUR"
    | "USDT"
    | "VND";

const currencies: Currency[] = [
    "RUB",
    "USD",
    "EUR",
    "USDT",
    "VND",
];

export default function CurrencyCalculator() {
    const [rates, setRates] =
        useState<any>(null);

    const [currency, setCurrency] =
        useState<Currency>("RUB");

    const [amount, setAmount] =
        useState("10000");

    useEffect(() => {
        getRates().then(setRates);
    }, []);

    const numericAmount =
        Number(amount.replace(/\s/g, "")) || 0;

    const results = useMemo(() => {
        if (!rates) return null;

        if (currency === "VND") {
            return {
                RUB:
                    numericAmount /
                    rates.RUB,

                USD:
                    numericAmount /
                    rates.USD,

                EUR:
                    numericAmount /
                    rates.EUR,

                USDT:
                    numericAmount /
                    rates.USDT,
            };
        }

        return {
            VND:
                numericAmount *
                rates[currency],
        };
    }, [
        currency,
        numericAmount,
        rates,
    ]);

    const formatInput = (
        value: string
    ) => {
        const numbers =
            value.replace(/\D/g, "");

        if (!numbers) return "";

        return Number(
            numbers
        ).toLocaleString("ru-RU");
    };

    if (!rates) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow">
                Загрузка курсов...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 shadow">
                <h3 className="font-semibold mb-4">
                    Валюта
                </h3>

                <div
                    className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
                >
                    <select
                        value={currency}
                        onChange={(e) =>
                            setCurrency(
                                e.target
                                    .value as Currency
                            )
                        }
                        className="
              border
              border-gray-200
              rounded-2xl
              px-4
              py-3
            "
                    >
                        {currencies.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            )
                        )}
                    </select>

                    <input
                        value={amount}
                        onChange={(e) =>
                            setAmount(
                                formatInput(
                                    e.target.value
                                )
                            )
                        }
                        placeholder="Введите сумму"
                        className="
              border
              border-gray-200
              rounded-2xl
              px-4
              py-3
            "
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow">
                <h3 className="font-semibold mb-4">
                    Результат
                </h3>

                {currency === "VND" ? (
                    <div className="space-y-4">
                        <ResultRow
                            label="🇷🇺 RUB"
                            value={results?.RUB}
                        />

                        <ResultRow
                            label="🇺🇸 USD"
                            value={results?.USD}
                        />

                        <ResultRow
                            label="🇪🇺 EUR"
                            value={results?.EUR}
                        />

                        <ResultRow
                            label="🪙 USDT"
                            value={results?.USDT}
                        />
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-6xl mb-4">
                            🇻🇳
                        </div>

                        <div className="text-3xl font-bold">
                            {Number(
                                results?.VND || 0
                            ).toLocaleString(
                                "ru-RU"
                            )}{" "}
                            ₫
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-3xl p-5 shadow">
                <h3 className="font-semibold mb-4">
                    Актуальные курсы
                </h3>

                <div className="space-y-3">
                    <RateRow
                        label="🇷🇺 RUB"
                        value={rates.RUB}
                    />

                    <RateRow
                        label="🇺🇸 USD"
                        value={rates.USD}
                    />

                    <RateRow
                        label="🇪🇺 EUR"
                        value={rates.EUR}
                    />

                    <RateRow
                        label="🪙 USDT"
                        value={rates.USDT}
                    />
                </div>
            </div>

            <button
                onClick={() =>
                    window.open(
                        "https://t.me/YOUR_USERNAME",
                        "_blank"
                    )
                }
                className="
          w-full
          bg-green-600
          hover:bg-green-700
          text-white
          font-semibold
          py-4
          rounded-2xl
          transition
        "
            >
                Связаться для обмена
            </button>
        </div>
    );
}

function ResultRow({
                       label,
                       value,
                   }: {
    label: string;
    value?: number;
}) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>

            <strong>
                {(value ?? 0).toFixed(2)}
            </strong>
        </div>
    );
}

function RateRow({
                     label,
                     value,
                 }: {
    label: string;
    value?: number;
}) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>

            <strong>
                {Number(value ?? 0).toLocaleString(
                    "ru-RU"
                )} ₫
            </strong>
        </div>
    );
}