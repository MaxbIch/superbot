function readEnv(name: string): string | undefined {
    const value = process.env[name];
    if (!value) return undefined;
    return value.trim().replace(/^['"]|['"]$/g, "");
}

async function telegramApi(token: string, method: string, body: Record<string, unknown>) {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const raw = await response.text();
    try {
        return JSON.parse(raw) as { ok: boolean; description?: string; result?: unknown };
    } catch {
        return { ok: false, description: raw };
    }
}

export default async function handler(
    req: { method?: string; query?: Record<string, string | string[] | undefined> },
    res: { status: (code: number) => { json: (data: unknown) => void } },
) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const token = readEnv("TELEGRAM_BOT_TOKEN");
    const secret = readEnv("TELEGRAM_WEBHOOK_SECRET");
    const querySecret = req.query?.secret;
    const querySecretValue = Array.isArray(querySecret) ? querySecret[0] : querySecret;

    if (!token || !secret) {
        return res.status(500).json({ error: "Telegram environment variables are missing" });
    }

    if (querySecretValue !== secret) return res.status(401).json({ error: "Unauthorized" });

    const webhookUrl = "https://superbot-one.vercel.app/api/telegram-webhook";
    const result = await telegramApi(token, "setWebhook", {
        url: webhookUrl,
        secret_token: secret,
        allowed_updates: ["message", "callback_query"],
    });

    if (!result.ok) {
        return res.status(502).json({ error: result.description ?? "Failed to set Telegram webhook" });
    }

    const info = await telegramApi(token, "getWebhookInfo", {});
    return res.status(200).json({
        ok: true,
        webhook: info.result,
    });
}
