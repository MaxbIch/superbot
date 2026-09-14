import {
    handleLeadSubmission,
    type LeadPayload,
} from "../lib/telegram";

function readPayload(body: unknown): LeadPayload | null {
    if (!body) return null;

    if (typeof body === "string") {
        try {
            return JSON.parse(body) as LeadPayload;
        } catch {
            return null;
        }
    }

    if (typeof body === "object") {
        return body as LeadPayload;
    }

    return null;
}

function readEnv(name: string): string | undefined {
    const value = process.env[name];

    if (!value) return undefined;

    return value.trim().replace(/^['"]|['"]$/g, "");
}

export default async function handler(
    req: { method?: string; body?: unknown },
    res: {
        status: (code: number) => {
            json: (data: unknown) => void;
        };
    },
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const payload = readPayload(req.body);

        if (!payload?.category || !payload?.title || !payload?.fields) {
            return res.status(400).json({
                error: "Invalid payload",
            });
        }

        const botToken = readEnv("TELEGRAM_BOT_TOKEN");
        const adminChatId = readEnv("TELEGRAM_ADMIN_CHAT_ID");

        if (!botToken || !adminChatId) {
            return res.status(500).json({
                error:
                    "На сервере не заданы TELEGRAM_BOT_TOKEN и TELEGRAM_ADMIN_CHAT_ID. Добавьте их в Vercel → Environment Variables и нажмите Redeploy.",
            });
        }

        await handleLeadSubmission(payload, botToken, adminChatId);

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("send-lead error:", error);

        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to send lead",
        });
    }
}
