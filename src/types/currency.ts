export type Currency =
    | "RUB"
    | "USD"
    | "EUR"
    | "USDT"
    | "VND";

export interface CurrencyRates {
    RUB: number;
    USD: number;
    EUR: number;
    USDT: number;
}