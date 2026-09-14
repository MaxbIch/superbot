const GOOGLE_FINANCE_URLS: Record<string, string> = {
    USD: "https://www.google.com/finance/quote/USD-VND",
    EUR: "https://www.google.com/finance/quote/EUR-VND",
    RUB: "https://www.google.com/finance/quote/RUB-VND",
};

export default async function handler(req: any, res: any) {
    try {
        const rates: Record<string, number> = {};

        for (const [currency, url] of Object.entries(GOOGLE_FINANCE_URLS)) {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; SuperBot Nha Trang/1.0)",
                    Accept: "text/html",
                },
            });

            if (!response.ok) {
                throw new Error(`Google Finance request failed for ${currency}: ${response.status}`);
            }

            const html = await response.text();
            const match = html.match(/data-last-price="([0-9.,]+)"/);

            if (!match) {
                throw new Error(`Google Finance rate not found for ${currency}`);
            }

            const value = Number(match[1].replace(/,/g, ""));

            if (!Number.isFinite(value) || value <= 0) {
                throw new Error(`Invalid Google Finance rate for ${currency}`);
            }

            rates[currency] = value;
        }

        return res.status(200).json(rates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to load Google Finance rates" });
    }
}
