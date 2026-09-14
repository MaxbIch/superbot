import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import Card from "./Card";
import Button from "./Button";
import { getRates, type Rates } from "../services/currencyService";
import { submitLead } from "../services/leadService";
import { hapticFeedback } from "../lib/telegram";

type Currency = "RUB" | "USD" | "EUR" | "USDT" | "VND";
type ExchangeCurrency = Exclude<Currency, "VND">;

const currencies: { value: ExchangeCurrency; label: string; flag: string }[] = [
    { value: "RUB", label: "RUB", flag: "🇷🇺" },
    { value: "USD", label: "USD", flag: "🇺🇸" },
    { value: "EUR", label: "EUR", flag: "🇪🇺" },
    { value: "USDT", label: "USDT", flag: "🪙" },
];

export default function CurrencyCalculator() {
    const [rates, setRates] = useState<Rates | null>(null);
    const [fromCurrency, setFromCurrency] = useState<Currency>("RUB");
    const [toCurrency, setToCurrency] = useState<ExchangeCurrency>("USD");
    const [amount, setAmount] = useState("10000");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const loadRates = async () => {
        try {
            setRates(await getRates());
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
    const isVndSource = fromCurrency === "VND";

    const calculation = useMemo(() => {
        if (!rates) return null;

        if (isVndSource) {
            const rate = rates[toCurrency].rate;
            return {
                result: numericAmount / rate,
                rate,
                isVip: false,
                minVip: 0,
            };
        }

        const rate = rates[fromCurrency];
        const activeRate = numericAmount >= rate.minVip ? rate.vip : rate.rate;
        return {
            result: numericAmount * activeRate,
            rate: activeRate,
            isVip: numericAmount >= rate.minVip,
            minVip: rate.minVip,
        };
    }, [rates, numericAmount, fromCurrency, toCurrency, isVndSource]);

    const formatInput = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        if (!numbers) return "";
        return Number(numbers).toLocaleString("ru-RU");
    };

    const handleFromCurrency = (value: Currency) => {
        setFromCurrency(value);
        setSent(false);
        if (value === "VND" && toCurrency === "VND") setToCurrency("USD");
    };

    const handleExchange = async () => {
        if (!calculation) return;
        setLoading(true);
        setError("");

        const resultCurrency = isVndSource ? toCurrency : "VND";
        const fields: Record<string, string> = {
            "Отдаю": `${amount} ${fromCurrency}`,
            "Получаю": `${Number(calculation.result).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ${resultCurrency}`,
            "Курс": String(calculation.rate),
        };

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
            setError(err instanceof Error ? err.message : "Не удалось отправить заявку");
        } finally {
            setLoading(false);
        }
    };

    if (!rates) {
        return (
            <Card>
                <div className="animate-shimmer h-32 rounded-xl" />
                <p className="text-center text-ink-muted mt-4 text-sm">Загрузка курсов...</p>
            </Card>
        );
    }

    const sourceCurrencies: { value: Currency; label: string; flag: string }[] = [
        ...currencies,
        { value: "VND", label: "VND", flag: "🇻🇳" },
    ];

    return (
        <div className="space-y-4 animate-fade-in-up">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-ink">Калькулятор</h3>
                    <button onClick={loadRates} className="p-2 rounded-lg hover:bg-brand-50 text-brand-600 transition" aria-label="Обновить курсы">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-sm text-ink-muted mb-3">Отдаю</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                    {sourceCurrencies.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => handleFromCurrency(item.value)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all min-h-[64px] ${fromCurrency === item.value ? "border-brand-600 bg-brand-50 shadow-sm" : "border-border bg-surface-muted hover:border-brand-300"}`}
                        >
                            <span className="text-xl">{item.flag}</span>
                            <span className="text-xs font-semibold">{item.label}</span>
                        </button>
                    ))}
                </div>

                {isVndSource && (
                    <>
                        <p className="text-sm text-ink-muted mb-3">Получаю</p>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {currencies.map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => { setToCurrency(item.value); setSent(false); }}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all min-h-[64px] ${toCurrency === item.value ? "border-brand-600 bg-brand-50 shadow-sm" : "border-border bg-surface-muted hover:border-brand-300"}`}
                                >
                                    <span className="text-xl">{item.flag}</span>
                                    <span className="text-xs font-semibold">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <input
                    value={amount}
                    onChange={(e) => setAmount(formatInput(e.target.value))}
                    placeholder={`Введите сумму в ${fromCurrency}`}
                    inputMode="numeric"
                    className="w-full border-2 border-border rounded-xl px-4 py-3.5 text-lg font-semibold text-ink focus:outline-none focus:border-brand-500 bg-surface-muted transition"
                />
            </Card>

            <Card className="bg-gradient-to-r from-brand-50 to-emerald-50 border-brand-100">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-ink-muted">Курс</p>
                        <p className="text-xl font-bold text-brand-700">
                            {Number(calculation.rate).toLocaleString("ru-RU")} ₫ за 1 {isVndSource ? toCurrency : fromCurrency}
                        </p>
                    </div>
                    <span className="text-xs text-ink-muted text-right">Google / актуальный курс</span>
                </div>
                {!isVndSource && calculation.isVip && (
                    <div className="mt-2 text-xs text-brand-700 font-semibold">⭐ VIP-курс</div>
                )}
            </Card>

            <Card>
                <h3 className="font-semibold text-ink mb-4">Результат</h3>
                <div className="text-center py-4">
                    <div className="text-5xl mb-3">
                        {(isVndSource ? currencies.find((item) => item.value === toCurrency) : { flag: "🇻🇳" })?.flag}
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-brand-700">
                        {Number(calculation.result).toLocaleString("ru-RU", { maximumFractionDigits: 2 })}{" "}
                        <span className="text-2xl">{isVndSource ? toCurrency : "VND"}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">
                        за {Number(numericAmount).toLocaleString("ru-RU")} {fromCurrency}
                    </p>
                </div>
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

            {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}

            {sent ? (
                <div className="text-center py-4 text-brand-600 font-semibold">✅ Заявка на обмен отправлена!</div>
            ) : (
                <Button fullWidth size="lg" icon="💵" loading={loading} onClick={handleExchange}>Заказать обмен</Button>
            )}
        </div>
    );
}

function RateRow({ label, value }: { label: string; value?: number }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted">{label}</span>
            <strong className="text-ink">{Number(value ?? 0).toLocaleString("ru-RU")} ₫</strong>
        </div>
    );
}
