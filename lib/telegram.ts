export interface TelegramUser {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
}

export interface LeadPayload {
    category: string;
    title: string;
    emoji?: string;
    fields: Record<string, string>;
    user?: TelegramUser;
    extra?: string;
}

export function formatLeadMessage(payload: LeadPayload): string {
    const lines: string[] = [];

    lines.push(
        `<b>${payload.emoji ?? "📋"} ${escapeHtml(payload.title)}</b>`,
    );
    lines.push(`<i>Категория: ${payload.category}</i>`);
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

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export async function sendTelegramMessage(
    botToken: string,
    chatId: string,
    text: string,
): Promise<void> {
    const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "HTML",
            }),
        },
    );

    if (!response.ok) {
        const raw = await response.text();
        throw new Error(formatTelegramError(raw, chatId));
    }
}

function formatTelegramError(raw: string, chatId: string): string {
    try {
        const data = JSON.parse(raw) as {
            description?: string;
        };

        const description = data.description ?? raw;

        if (description.includes("chat not found")) {
            return `Telegram: чат ${chatId} не найден. Проверьте TELEGRAM_ADMIN_CHAT_ID (для группы ID вида -100…), бот должен быть в группе.`;
        }

        if (
            description.includes("bot was blocked") ||
            description.includes("can't initiate conversation")
        ) {
            return "Telegram: напишите боту /start в личку (если заявки идут на ваш ID) или добавьте бота в группу админов.";
        }

        if (description.includes("not a member")) {
            return "Telegram: бот не состоит в группе. Добавьте бота в группу и дайте право писать сообщения.";
        }

        if (description.includes("Unauthorized")) {
            return "Telegram: неверный TELEGRAM_BOT_TOKEN. Проверьте токен в BotFather и в Vercel.";
        }

        return `Telegram: ${description}`;
    } catch {
        return `Telegram API error: ${raw}`;
    }
}

export async function handleLeadSubmission(
    payload: LeadPayload,
    botToken?: string,
    adminChatId?: string,
): Promise<{ ok: true }> {
    if (!botToken || !adminChatId) {
        throw new Error(
            "Telegram bot is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID.",
        );
    }

    const text = formatLeadMessage(payload);
    await sendTelegramMessage(botToken, adminChatId, text);

    return { ok: true };
}
