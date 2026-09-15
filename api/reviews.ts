import { createHmac, timingSafeEqual } from "node:crypto";

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
    if (!url || !token) throw new Error("Reviews storage environment variables are missing");

    const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(command),
    });
    const json = (await response.json()) as { result?: unknown; error?: string };
    if (!response.ok || json.error) throw new Error(json.error ?? "Redis request failed");
    return json.result;
}

function validateTelegramInitData(initData: string, botToken: string) {
    const params = new URLSearchParams(initData);
    const receivedHash = params.get("hash");
    if (!receivedHash) return null;

    params.delete("hash");
    const dataCheckString = [...params.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
    const calculatedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
    const received = Buffer.from(receivedHash, "hex");
    const calculated = Buffer.from(calculatedHash, "hex");
    if (received.length !== calculated.length || !timingSafeEqual(received, calculated)) return null;

    const authDate = Number(params.get("auth_date"));
    if (!authDate || Math.abs(Date.now() / 1000 - authDate) > 86400) return null;

    const userRaw = params.get("user");
    if (!userRaw) return null;
    try {
        return JSON.parse(userRaw) as { id?: number; username?: string; first_name?: string; last_name?: string };
    } catch {
        return null;
    }
}

export default async function handler(
    req: { method?: string; body?: unknown },
    res: { status: (code: number) => { json: (data: unknown) => void } },
) {
    if (req.method === "GET") {
        try {
            const raw = await redisCommand(["LRANGE", "superbot:reviews", "0", "49"]);
            const reviews = Array.isArray(raw)
                ? raw.map((item) => {
                    try { return JSON.parse(String(item)) as Review; } catch { return null; }
                }).filter((item): item is Review => Boolean(item))
                : [];
            return res.status(200).json({ reviews });
        } catch (error) {
            console.error("reviews api error:", error);
            return res.status(500).json({ error: "Failed to load reviews", reviews: [] });
        }
    }

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = (req.body ?? {}) as { text?: unknown; rating?: unknown; name?: unknown; initData?: unknown };
        const text = typeof body.text === "string" ? body.text.trim() : "";
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const rating = Number(body.rating);
        const initData = typeof body.initData === "string" ? body.initData : "";
        const botToken = readEnv("TELEGRAM_BOT_TOKEN");

        if (!botToken) return res.status(500).json({ error: "Telegram environment variables are missing" });
        if (text.length < 3 || text.length > 1000) return res.status(400).json({ error: "Отзыв должен содержать от 3 до 1000 символов" });
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: "Оценка должна быть от 1 до 5" });
        if (name.length > 80) return res.status(400).json({ error: "Имя должно содержать не более 80 символов" });

        const user = validateTelegramInitData(initData, botToken);
        if (!user?.id) return res.status(401).json({ error: "Не удалось определить пользователя Telegram" });

        const username = name || "Житель Нячанга";
        const review: Review = {
            id: `telegram:${user.id}:${Date.now()}`,
            username,
            text,
            rating,
            date: new Date().toISOString(),
        };

        await redisCommand(["LPUSH", "superbot:reviews", JSON.stringify(review)]);
        await redisCommand(["LTRIM", "superbot:reviews", "0", "49"]);
        return res.status(201).json({ review });
    } catch (error) {
        console.error("review create api error:", error);
        return res.status(500).json({ error: "Не удалось сохранить отзыв" });
    }
}
