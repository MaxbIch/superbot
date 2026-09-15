interface Review {
    id: string;
    username: string;
    text: string;
    rating: number;
    date: string;
}

function readEnv(name: string): string | undefined {
    const value = process.env[name];
    if (!value) return undefined;
    return value.trim().replace(/^['"]|['"]$/g, "");
}

async function redisCommand(command: string[]): Promise<unknown> {
    const url = readEnv("UPSTASH_REDIS_REST_URL");
    const token = readEnv("UPSTASH_REDIS_REST_TOKEN");

    if (!url || !token) {
        throw new Error("Reviews storage environment variables are missing");
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
    });

    const json = (await response.json()) as {
        result?: unknown;
        error?: string;
    };

    if (!response.ok || json.error) {
        throw new Error(json.error ?? "Redis request failed");
    }

    return json.result;
}

export default async function handler(
    req: { method?: string },
    res: {
        status: (code: number) => { json: (data: unknown) => void };
    },
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const raw = await redisCommand(["LRANGE", "superbot:reviews", "0", "49"]);
        const reviews = Array.isArray(raw)
            ? raw
                .map((item) => {
                    try {
                        return JSON.parse(String(item)) as Review;
                    } catch {
                        return null;
                    }
                })
                .filter((item): item is Review => Boolean(item))
            : [];

        return res.status(200).json({ reviews });
    } catch (error) {
        console.error("reviews api error:", error);
        return res.status(500).json({
            error: "Failed to load reviews",
            reviews: [],
        });
    }
}
