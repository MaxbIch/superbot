import {
    handleLeadSubmission,
    type LeadPayload,
} from "../lib/telegram";

export default async function handler(
    req: { method?: string; body?: LeadPayload },
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
        const payload = req.body;

        if (!payload?.category || !payload?.title || !payload?.fields) {
            return res.status(400).json({ error: "Invalid payload" });
        }

        await handleLeadSubmission(
            payload,
            process.env.TELEGRAM_BOT_TOKEN,
            process.env.TELEGRAM_ADMIN_CHAT_ID,
        );

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to send lead",
        });
    }
}
