const GOOGLE_FINANCE_PAIRS = ["USD-VND", "EUR-VND", "RUB-VND", "USDT-VND"] as const;

type GooglePair = (typeof GOOGLE_FINANCE_PAIRS)[number];

const RPC_URL = "https://www.google.com/finance/_/GoogleFinanceUi/data/batchexecute";

function buildRequest(pair: GooglePair, index: number) {
    const [base, quote] = pair.split("-");
    const tickerTuple = [null, null, [base, quote]];

    return [
        "xh8wxf",
        JSON.stringify([[tickerTuple], 1]),
        null,
        String(index),
    ];
}

function parseRpcResponse(raw: string): number[] {
    const stripped = raw.replace(/^\)\]\}'\n\n?/, "");
    const prices: number[] = [];
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
                    prices.push(price);
                }
            }
        } catch {
            // Ignore non-JSON chunks and continue parsing the response.
        }
    }

    return prices;
}

export default async function handler(req: any, res: any) {
    try {
        const requests = GOOGLE_FINANCE_PAIRS.map((pair, index) => buildRequest(pair, index + 1));
        const rpcids = "xh8wxf";
        const body = `f.req=${encodeURIComponent(JSON.stringify([requests]))}`;
        const sourcePath = `/finance/quote/${GOOGLE_FINANCE_PAIRS[0]}`;

        const response = await fetch(
            `${RPC_URL}?rpcids=${rpcids}&source-path=${encodeURIComponent(sourcePath)}&hl=en&gl=us&rt=c`,
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
            throw new Error(`Google Finance request failed: ${response.status}`);
        }

        const prices = parseRpcResponse(await response.text());

        if (prices.length !== GOOGLE_FINANCE_PAIRS.length) {
            throw new Error(`Google Finance returned ${prices.length}/${GOOGLE_FINANCE_PAIRS.length} rates`);
        }

        const rates: Record<string, number> = {};
        GOOGLE_FINANCE_PAIRS.forEach((pair, index) => {
            const [currency] = pair.split("-");
            rates[currency] = prices[index];
        });

        return res.status(200).json(rates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to load Google Finance rates" });
    }
}
