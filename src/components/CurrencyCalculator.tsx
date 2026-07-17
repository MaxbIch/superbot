import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import Card from "./Card";
import Button from "./Button";
import { getRates, type Rates } from "../services/currencyService";
import { submitLead } from "../services/leadService";
import { hapticFeedback } from "../lib/telegram";

type Currency = "RUB" | "USD" | "EUR" | "USDT" | "VND";

const currencies: { value: Currency; label: string; flag: string }[] = [
    { value: "RUB", label: "RUB", flag: "🇷🇺" },
    { value: "USD", label: "USD", flag: "🇺🇸" },
    { value: "EUR", label: "EUR", flag: "🇪🇺" },
    { value: "USDT", label: "USDT", flag: "🪙" },
    { value: "VND", label: "VND", flag: "🇻🇳" },
];

export default function CurrencyCalculator() {
    const [rates, setRates] = useState<Rates | null>(null);
    const [currency, setCurrency] = useState<Currency>("RUB");
    const [amount, setAmount] = useState("10000");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const loadRates = async () => {
        try {
            const data = await getRates();
            setRates(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadRates();
        const interval = setInterval(loadRates, 60000);
        return () => clearInterval(interval);
    }, []);

    const numericAmount = Number(amount.replace(/\s/g, "")) || 0;

    const calculation = useMemo(() => {
        if (!rates) return null;

        if (currency === "VND") {
            return {
                results: {
                    RUB: numericAmount / rates.RUB.rate,
                    USD: numericAmount / rates.USD.rate,
                    EUR: numericAmount / rates.EUR.rate,
                    USDT: numericAmount / rates.USDT.rate,
                },
            };
        }

        const currencyRate = rates[currency];
        const activeRate =
            numericAmount >= currencyRate.minVip
                ? currencyRate.vip
                : currencyRate.rate;
        const isVip = numericAmount >= currencyRate.minVip;

        return {
            results: { VND: numericAmount * activeRate },
            activeRate,
            isVip,
            minVip: currencyRate.minVip,
        };
    }, [numericAmount, currency, rates]);

    const formatInput = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        if (!numbers) return "";
        return Number(numbers).toLocaleString("ru-RU");
    };

    const handleExchange = async () => {
        setLoading(true);
        setError("");

        const fields: Record<string, string> = {
            "Отдаю": `${amount} ${currency}`,
        };

        if (currency !== "VND" && calculation?.results?.VND) {
            fields["Получаю"] = `${Number(calculation.results.VND).toLocaleString("ru-RU")} ₫`;
            fields["Курс"] = String(calculation.activeRate);
        }

        try {
            await submitLead({
                category: "currency",
                title: "Заявка на обмен валют",
                emoji: "💵",
                fields,
            });

            hapticFeedback("success");
            setSent(true);
        } catch (err) {
            hapticFeedback("error");
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось отправить заявку",
            );
        } finally {
            setLoading(false);
        }
    };

    if (!rates) {
        return (
            <Card>
                <div className="animate-shimmer h-32 rounded-xl" />
                <p className="text-center text-ink-muted mt-4 text-sm">
                    Загрузка курсов...
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in-up">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-ink">Калькулятор</h3>
                    <button
                        onClick={loadRates}
                        className="p-2 rounded-lg hover:bg-brand-50 text-brand-600 transition"
                        aria-label="Обновить курсы"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                    {currencies.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => setCurrency(item.value)}
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl
                                border-2 transition-all min-h-[64px]
                                ${
                                    currency === item.value
                                        ? "border-brand-600 bg-brand-50 shadow-sm"
                                        : "border-border bg-surface-muted hover:border-brand-300"
                                }
                            `}
                        >
                            <span className="text-xl">{item.flag}</span>
                            <span className="text-xs font-semibold">{item.label}</span>
                        </button>
                    ))}
                </div>

                <input
                    value={amount}
                    onChange={(e) => setAmount(formatInput(e.target.value))}
                    placeholder="Введите сумму"
                    inputMode="numeric"
                    className="
                        w-full border-2 border-border rounded-xl
                        px-4 py-3.5 text-lg font-semibold text-ink
                        focus:outline-none focus:border-brand-500
                        bg-surface-muted transition
                    "
                />
            </Card>

            {currency !== "VND" && calculation && (
                <Card className="bg-gradient-to-r from-brand-50 to-emerald-50 border-brand-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-ink-muted">Курс</p>
                            <p className="text-xl font-bold text-brand-700">
                                {calculation.activeRate?.toLocaleString("ru-RU")} ₫
                            </p>
                        </div>
                        {calculation.isVip ? (
                            <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold">
                                ⭐ VIP
                            </span>
                        ) : (
                            <span className="text-xs text-ink-muted text-right max-w-[140px]">
                                VIP от {(calculation.minVip ?? 0).toLocaleString("ru-RU")} {currency}
                            </span>
                        )}
                    </div>
                </Card>
            )}

            <Card>
                <h3 className="font-semibold text-ink mb-4">Результат</h3>

                {currency === "VND" ? (
                    <div className="space-y-3">
                        <ResultRow label="🇷🇺 RUB" value={calculation?.results?.RUB} />
                        <ResultRow label="🇺🇸 USD" value={calculation?.results?.USD} />
                        <ResultRow label="🇪🇺 EUR" value={calculation?.results?.EUR} />
                        <ResultRow label="🪙 USDT" value={calculation?.results?.USDT} />
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-5xl mb-3">🇻🇳</div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-brand-700">
                            {Number(calculation?.results?.VND || 0).toLocaleString("ru-RU")}{" "}
                            <span className="text-2xl">₫</span>
                        </div>
                    </div>
                )}
            </Card>

            <Card>
                <h3 className="font-semibold text-ink mb-4">Актуальные курсы</h3>
                <div className="space-y-3">
                    <RateRow label="🇷🇺 RUB" value={rates.RUB.rate} />
                    <RateRow label="🇺🇸 USD" value={rates.USD.rate} />
                    <RateRow label="🇪🇺 EUR" value={rates.EUR.rate} />
                    <RateRow label="🪙 USDT" value={rates.USDT.rate} />
                </div>
            </Card>

            {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {sent ? (
                <div className="text-center py-4 text-brand-600 font-semibold">
                    ✅ Заявка на обмен отправлена!
                </div>
            ) : (
                <Button
                    fullWidth
                    size="lg"
                    icon="💵"
                    loading={loading}
                    onClick={handleExchange}
                >
                    Заказать обмен
                </Button>
            )}
        </div>
    );
}

function ResultRow({ label, value }: { label: string; value?: number }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
            <span className="text-sm">{label}</span>
            <strong className="text-ink">{(value ?? 0).toFixed(2)}</strong>
        </div>
    );
}

function RateRow({ label, value }: { label: string; value?: number }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted">{label}</span>
            <strong className="text-ink">
                {Number(value ?? 0).toLocaleString("ru-RU")} ₫
            </strong>
        </div>
    );
}
