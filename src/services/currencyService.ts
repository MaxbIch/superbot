export interface Rates {
    RUB: number;
    USD: number;
    EUR: number;
    USDT: number;
}

export async function getRates(): Promise<Rates> {
    return {
        RUB: 320,
        USD: 26000,
        EUR: 29800,
        USDT: 25900,
    };
}