const GOOGLE_FINANCE_PAIRS = ["USD-VND", "EUR-VND", "RUB-VND", "USDT-VND"] as const;

type GooglePair = (typeof GOOGLE_FINANCE_PAIRS)[number];

function parseGoogleNumber(value: string): number {
    const normalized = value.replace(/,/g, "").trim();
    const number = Number(normalized);

    if (!Number.isFinite(number) || number <= 0) {
        throw new Error(`Invalid Google Finance price: ${value}`);
    }

    return number;
}

function extractPrice(html: string, pair: GooglePair): number {
    // Google Finance currently renders the main quote with the
    // YMlKec / fxKbKc classes. Keep a few fallbacks because Google
    // can change the markup without notice.
    const patterns = [
        /class="YMlKec fxKbKc"[^>]*>([^<]+)</,
        /class="[^"]*YMlKec[^"]*fxKbKc[^"]*"[^>]*>([^<]+)</,
        /data-last-price="([0-9.,]+)"/,
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) {
            return parseGoogleNumber(match[1]);
        }
    }

    throw new Error(`Google Finance rate not found for ${pair}`);
}

async function fetchGoogleRate(pair: GooglePair): Promise<number> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(
            `https://www.google.com/finance/beta/quote/${pair}?hl=en&gl=us`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
                        "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                },
                signal: controller.signal,
            },
        );

        if (!response.ok) {
            throw new Error(`Google Finance request failed for ${pair}: ${response.status}`);
        }

        return extractPrice(await response.text(), pair);
    } finally {
        clearTimeout(timeout);
    }
}

export default async function handler(req: any, res: any) {
    try {
        const values = await Promise.all(
            GOOGLE_FINANCE_PAIRS.map(async (pair) => [pair, await fetchGoogleRate(pair)] as const),
        );

        const rates: Record<string, number> = {};

        for (const [pair, rate] of values) {
            const [currency] = pair.split("-");
            rates[currency] = rate;
        }

        return res.status(200).json(rates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to load Google Finance rates" });
    }
}
