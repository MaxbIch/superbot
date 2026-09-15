interface TelegramMessage {
    chat?: {
        id?: number;
        type?: string;
    };
    text?: string;
    reply_to_message?: {
        text?: string;
        caption?: string;
    };
    from?: {
        id?: number;
        first_name?: string;
        username?: string;
    };
}

interface TelegramUpdate {
    message?: TelegramMessage;
}

function readEnv(name: string): string | undefined {
    const value = process.env[name];
    if (!value) return undefined;
    return value.trim().replace(/^['"]|['"]$/g, "");
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function getClientId(message: TelegramMessage): string | undefined {
    const source =
        message.reply_to_message?.text ??
        message.reply_to_message?.caption ??
        "";

    const match = source.match(/(?:^|\n)ID:\s*(\d+)/);
    return match?.[1];
}

async function telegramApi(
    token: string,
    method: string,
    body: Record<string, unknown>,
): Promise<{ ok: boolean; description?: string }> {
    const response = await fetch(
        `https://api.telegram.org/bot${token}/${method}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        },
    );

    const raw = await response.text();

    try {
        return JSON.parse(raw) as {
            ok: boolean;
            description?: string;
        };
    } catch {
        return {
            ok: false,
            description: raw,
        };
    }
}

async function sendWelcome(
    token: string,
    chatId: number,
    firstName?: string,
): Promise<{ ok: boolean; description?: string }> {
    const greeting = firstName
        ? `👋 Привет, ${escapeHtml(firstName)}!`
        : "👋 Привет!";

    return telegramApi(token, "sendMessage", {
        chat_id: chatId,
        text:
            `${greeting}\n\n` +
            `Добро пожаловать в <b>Super Bot Nha Trang</b> 🌴\n\n` +
            `Здесь ты найдёшь всё необходимое для жизни и отдыха в Нячанге:\n\n` +
            `🏠 Жильё\n` +
            `🛵 Байки\n` +
            `🚗 Авто\n` +
            `💵 Обмен валют\n` +
            `🛂 Визы\n` +
            `🌴 Туры\n` +
            `⭐ Отзывы\n\n` +
            `Нажимай кнопку ниже и выбирай нужную услугу 👇`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🚀 Открыть Super Bot",
                        web_app: {
                            url: "https://superbot-one.vercel.app",
                        },
                    },
                ],
            ],
        },
    });
}

async function forwardDirectMessage(
    token: string,
    adminChatId: string,
    message: TelegramMessage,
): Promise<{ ok: boolean; description?: string }> {
    const messageText = message.text?.trim();
    if (!messageText || !message.chat?.id) {
        return { ok: true };
    }

    const firstName = message.from?.first_name?.trim() || "Без имени";
    const username = message.from?.username
        ? `@${message.from.username}`
        : "не указан";
    const userId = message.from?.id ?? message.chat.id;

    return telegramApi(token, "sendMessage", {
        chat_id: adminChatId,
        text:
            `📩 <b>Сообщение напрямую боту</b>\n\n` +
            `👤 <b>${escapeHtml(firstName)}</b>\n` +
            `Username: ${escapeHtml(username)}\n` +
            `ID: <code>${userId}</code>\n\n` +
            `${escapeHtml(messageText)}\n\n` +
            `↩️ Ответьте на это сообщение, чтобы отправить ответ клиенту.`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "💬 Открыть контакт",
                        url: `tg://user?id=${userId}`,
                    },
                ],
            ],
        },
    });
}

export default async function handler(
    req: {
        method?: string;
        body?: unknown;
        headers?: Record<string, string | string[] | undefined>;
    },
    res: {
        status: (code: number) => {
            json: (data: unknown) => void;
        };
    },
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = readEnv("TELEGRAM_BOT_TOKEN");
    const adminChatId = readEnv("TELEGRAM_ADMIN_CHAT_ID");
    const webhookSecret = readEnv("TELEGRAM_WEBHOOK_SECRET");

    if (!token || !adminChatId || !webhookSecret) {
        return res.status(500).json({
            error: "Telegram environment variables are missing",
        });
    }

    const receivedSecret = req.headers?.["x-telegram-bot-api-secret-token"];
    const receivedSecretValue = Array.isArray(receivedSecret)
        ? receivedSecret[0]
        : receivedSecret;

    if (receivedSecretValue !== webhookSecret) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const update = req.body as TelegramUpdate | undefined;
    const message = update?.message;

    if (!message?.chat?.id) {
        return res.status(200).json({ ok: true });
    }

    const messageText = message.text?.trim();

    // Welcome message for users who press Start.
    if (
        message.chat.type === "private" &&
        messageText &&
        /^\/start(?:\s|$)/i.test(messageText)
    ) {
        const result = await sendWelcome(
            token,
            message.chat.id,
            message.from?.first_name,
        );

        if (!result.ok) {
            console.error("telegram welcome error:", result.description);
        }

        return res.status(200).json({ ok: result.ok });
    }

    // Any ordinary direct message to the bot is sent to the admin chat.
    if (message.chat.type === "private" && messageText) {
        const result = await forwardDirectMessage(token, adminChatId, message);

        if (!result.ok) {
            console.error("telegram direct message forwarding error:", result.description);
        }

        return res.status(200).json({ ok: result.ok });
    }

    // Admin replies to a lead are relayed back to the client.
    if (String(message.chat.id) !== adminChatId) {
        return res.status(200).json({ ok: true });
    }

    if (!messageText) {
        return res.status(200).json({ ok: true });
    }

    const clientId = getClientId(message);
    if (!clientId) {
        return res.status(200).json({ ok: true });
    }

    const result = await telegramApi(token, "sendMessage", {
        chat_id: clientId,
        text: `📩 <b>Сообщение от Super Bot Nha Trang</b>\n\n${escapeHtml(messageText)}`,
        parse_mode: "HTML",
    });

    if (!result.ok) {
        console.error("telegram reply error:", result.description);

        await telegramApi(token, "sendMessage", {
            chat_id: adminChatId,
            text: `⚠️ Не удалось отправить сообщение клиенту <code>${clientId}</code>.\n\n${escapeHtml(result.description ?? "Неизвестная ошибка Telegram")}`,
            parse_mode: "HTML",
        });

        return res.status(200).json({ ok: false });
    }

    return res.status(200).json({ ok: true });
}
