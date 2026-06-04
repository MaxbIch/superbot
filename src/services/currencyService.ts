export interface Rates {
    RUB: number;
    USD: number;
    EUR: number;
    USDT: number;
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