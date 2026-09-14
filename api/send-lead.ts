interface TelegramUser {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
}

interface LeadPayload {
    category: string;
    title: string;
    emoji?: string;
    fields: Record<string, string>;
    user?: TelegramUser;
    extra?: string;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function formatLeadMessage(payload: LeadPayload): string {
    const lines: string[] = [];

    lines.push(
        `<b>${payload.emoji ?? "📋"} ${escapeHtml(payload.title)}</b>`,
    );
    lines.push(`<i>Категория: ${escapeHtml(payload.category)}</i>`);
    lines.push("");

    for (const [key, value] of Object.entries(payload.fields)) {
        lines.push(`<b>${escapeHtml(key)}:</b> ${escapeHtml(value)}`);
    }

    if (payload.extra) {
        lines.push("");
        lines.push(escapeHtml(payload.extra));
    }

    if (payload.user) {
        lines.push("");
        lines.push("<b>👤 Клиент</b>");

        const name = [payload.user.first_name, payload.user.last_name]
            .filter(Boolean)
            .join(" ");

        if (name) {
            lines.push(`Имя: ${escapeHtml(name)}`);
        }

        if (payload.user.username) {
            lines.push(`Telegram: @${escapeHtml(payload.user.username)}`);
        }

        if (payload.user.id) {
            lines.push(`ID: ${payload.user.id}`);
        }
    }

    return lines.join("\n");
}

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

async function sendTelegramMessage(
    botToken: string,
    chatId: string,
    text: string,
    userId?: number,
): Promise<void> {
    const replyMarkup = userId
        ? {
              inline_keyboard: [
                  [
                      {
                          text: "💬 Написать клиенту",
                          url: `tg://user?id=${userId}`,
                      },
                  ],
              ],
          }
        : undefined;

    const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "HTML",
                ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
            }),
        },
    );

    if (!response.ok) {
        const raw = await response.text();

        try {
            const data = JSON.parse(raw) as { description?: string };
            const description = data.description ?? raw;

            if (description.includes("chat not found")) {
                throw new Error(
                    `Telegram: чат ${chatId} не найден. Проверьте TELEGRAM_ADMIN_CHAT_ID (для группы ID вида -100…), бот должен быть в группе.`,
                );
            }

            if (
                description.includes("bot was blocked") ||
                description.includes("can't initiate conversation")
            ) {
                throw new Error(
                    "Telegram: напишите боту /start в личку или добавьте бота в группу админов.",
                );
            }

            if (description.includes("not a member")) {
                throw new Error(
                    "Telegram: бот не состоит в группе. Добавьте бота в группу и дайте право писать сообщения.",
                );
            }

            if (description.includes("Unauthorized")) {
                throw new Error(
                    "Telegram: неверный TELEGRAM_BOT_TOKEN. Проверьте токен в BotFather и в Vercel.",
                );
            }

            throw new Error(`Telegram: ${description}`);
        } catch (error) {
            if (error instanceof Error && error.message.startsWith("Telegram:")) {
                throw error;
            }

            throw new Error(`Telegram API error: ${raw}`);
        }
    }
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
            return res.status(400).json({ error: "Invalid payload" });
        }

        const botToken = readEnv("TELEGRAM_BOT_TOKEN");
        const adminChatId = readEnv("TELEGRAM_ADMIN_CHAT_ID");

        if (!botToken || !adminChatId) {
            return res.status(500).json({
                error:
                    "На сервере не заданы TELEGRAM_BOT_TOKEN и TELEGRAM_ADMIN_CHAT_ID. Добавьте их в Vercel → Environment Variables и нажмите Redeploy.",
            });
        }

        await sendTelegramMessage(
            botToken,
            adminChatId,
            formatLeadMessage(payload),
            payload.user?.id,
        );

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
