export interface CurrencyRate {
    rate: number;
    vip: number;
    minVip: number;
}

export interface Rates {
    RUB: CurrencyRate;
    USD: CurrencyRate;
    EUR: CurrencyRate;
    USDT: CurrencyRate;
}

export async function getRates(): Promise<Rates> {
    const response =
        await fetch("/api/rates");

    if (!response.ok) {
        throw new Error(
            "Failed to load rates"
        );
    }

    return response.json();
}