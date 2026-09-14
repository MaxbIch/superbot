const GOOGLE_FINANCE_PAIRS = ["USD-VND", "EUR-VND", "RUB-VND", "USDT-VND"] as const;

type GooglePair = (typeof GOOGLE_FINANCE_PAIRS)[number];

const RPC_URL = "https://www.google.com/finance/_/GoogleFinanceUi/data/batchexecute";

function buildRequest(pair: GooglePair) {
    const [base, quote] = pair.split("-");
    const tickerTuple = [null, null, [base, quote]];

    return [
        "xh8wxf",
        JSON.stringify([[tickerTuple], 1]),
        null,
        "1",
    ];
}

function parseRpcResponse(raw: string): number | null {
    const stripped = raw.replace(/^\)\]\}'\n\n?/, "");
    const lines = stripped.split("\n");

    for (let i = 0; i < lines.length - 1; i += 1) {
        const sizeLine = lines[i]?.trim();
        const payloadLine = lines[i + 1];

        if (!sizeLine || !/^[0-9a-f ]+$/i.test(sizeLine)) continue;

        try {
            const entries = JSON.parse(payloadLine);

            for (const entry of entries) {
                if (entry?.[0] !== "wrb.fr" || entry?.[1] !== "xh8wxf" || !entry?.[2]) {
                    continue;
                }

                const data = JSON.parse(entry[2]);
                const quote = data?.[0]?.[0]?.[0];
                const price = quote?.[5]?.[0];

                if (typeof price === "number" && Number.isFinite(price) && price > 0) {
                    return price;
                }
            }
        } catch {
            // Ignore non-JSON chunks and continue parsing the response.
        }
    }

    return null;
}

async function fetchGoogleRate(pair: GooglePair): Promise<number> {
    const body = `f.req=${encodeURIComponent(JSON.stringify([[buildRequest(pair)]]))}`;
    const sourcePath = `/finance/quote/${pair}`;

    const response = await fetch(
        `${RPC_URL}?rpcids=xh8wxf&source-path=${encodeURIComponent(sourcePath)}&hl=en&gl=us&rt=c`,
        {
            method: "POST",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
                    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "identity",
                Cookie: "CONSENT=YES+",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body,
        },
    );

    if (!response.ok) {
        throw new Error(`Google Finance request failed for ${pair}: ${response.status}`);
    }

    const price = parseRpcResponse(await response.text());
    if (price === null) {
        throw new Error(`Google Finance rate not found for ${pair}`);
    }

    return price;
}

export default async function handler(req: any, res: any) {
    try {
        const prices = await Promise.all(
            GOOGLE_FINANCE_PAIRS.map(async (pair) => ({
                pair,
                price: await fetchGoogleRate(pair),
            })),
        );

        const rates: Record<string, number> = {};
        for (const { pair, price } of prices) {
            const [currency] = pair.split("-");
            rates[currency] = price;
        }

        return res.status(200).json(rates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to load Google Finance rates" });
    }
}
