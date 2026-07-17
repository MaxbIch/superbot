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

    lines.push(`<b>${payload.emoji ?? "📋"} ${payload.title}</b>`);
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
        const error = await response.text();
        throw new Error(`Telegram API error: ${error}`);
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
