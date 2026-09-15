interface TelegramMessage {
    message_id?: number;
    chat?: { id?: number; type?: string };
    text?: string;
    reply_to_message?: { text?: string; caption?: string };
    from?: { id?: number; first_name?: string; username?: string; is_bot?: boolean };
}

interface TelegramCallbackQuery {
    id?: string;
    data?: string;
    message?: TelegramMessage;
}

interface TelegramUpdate {
    message?: TelegramMessage;
    callback_query?: TelegramCallbackQuery;
}

interface PendingReview {
    id: string;
    chatId: number;
    messageId: number;
    username: string;
    text: string;
    date: string;
}

function readEnv(name: string): string | undefined {
    const value = process.env[name];
    if (!value) return undefined;
    return value.trim().replace(/^['"]|['"]$/g, "");
}

function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function telegramApi(token: string, method: string, body: Record<string, unknown>) {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const raw = await response.text();
    try {
        return JSON.parse(raw) as { ok: boolean; description?: string; result?: any };
    } catch {
        return { ok: false, description: raw };
    }
}

async function redisCommand(command: string[]): Promise<any> {
    const url = readEnv("UPSTASH_REDIS_REST_URL");
    const token = readEnv("UPSTASH_REDIS_REST_TOKEN");
    if (!url || !token) throw new Error("Reviews storage environment variables are missing");

    const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(command),
    });
    const json = (await response.json()) as { result?: any; error?: string };
    if (!response.ok || json.error) throw new Error(json.error ?? "Redis request failed");
    return json.result;
}

async function sendWelcome(token: string, chatId: number, firstName?: string) {
    const greeting = firstName ? `👋 Привет, ${escapeHtml(firstName)}!` : "👋 Привет!";
    return telegramApi(token, "sendMessage", {
        chat_id: chatId,
        text: `${greeting}\n\nДобро пожаловать в <b>Super Bot Nha Trang</b> 🌴\n\nЗдесь ты найдёшь всё необходимое для жизни и отдыха в Нячанге:\n\n🏠 Жильё\n🛵 Байки\n🚗 Авто\n💵 Обмен валют\n🛂 Визы\n🌴 Туры\n⭐ Отзывы\n\nНажимай кнопку ниже и выбирай нужную услугу 👇`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🚀 Открыть Super Bot", web_app: { url: "https://superbot-one.vercel.app" } }],
                [{ text: "⭐ Отзывы", url: "https://t.me/superbot_reviews" }],
            ],
        },
    });
}

async function forwardDirectMessage(token: string, adminChatId: string, message: TelegramMessage) {
    const messageText = message.text?.trim();
    if (!messageText || !message.chat?.id) return { ok: true };
    const firstName = message.from?.first_name?.trim() || "Без имени";
    const username = message.from?.username ? `@${message.from.username}` : "не указан";
    const userId = message.from?.id ?? message.chat.id;
    return telegramApi(token, "sendMessage", {
        chat_id: adminChatId,
        text: `📩 <b>Сообщение напрямую боту</b>\n\n👤 <b>${escapeHtml(firstName)}</b>\nUsername: ${escapeHtml(username)}\nID: <code>${userId}</code>\n\n${escapeHtml(messageText)}\n\n↩️ Ответьте на это сообщение, чтобы отправить ответ клиенту.`,
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: [[{ text: "💬 Открыть контакт", url: `tg://user?id=${userId}` }]] },
    });
}

async function createPendingReview(token: string, message: TelegramMessage) {
    const chatId = message.chat?.id;
    const messageId = message.message_id;
    const text = message.text?.trim();
    const reviewsChatId = readEnv("TELEGRAM_REVIEWS_CHAT_ID");
    if (!chatId || !messageId || !text || String(chatId) !== reviewsChatId || message.from?.is_bot) return;

    const username = message.from?.username ? `@${message.from.username}` : message.from?.first_name?.trim() || "Аноним";
    const pending: PendingReview = {
        id: `${chatId}:${messageId}`,
        chatId,
        messageId,
        username,
        text,
        date: new Date().toISOString(),
    };

    await redisCommand(["SET", `superbot:review:pending:${pending.id}`, JSON.stringify(pending), "EX", "86400"]);
    await telegramApi(token, "sendMessage", {
        chat_id: chatId,
        reply_to_message_id: messageId,
        text: "⭐ <b>Как вы оцениваете Super Bot?</b>\n\nВыберите оценку от 1 до 5:",
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "⭐ 1", callback_data: `review:${messageId}:1` },
                { text: "⭐ 2", callback_data: `review:${messageId}:2` },
                { text: "⭐ 3", callback_data: `review:${messageId}:3` },
                { text: "⭐ 4", callback_data: `review:${messageId}:4` },
                { text: "⭐ 5", callback_data: `review:${messageId}:5` },
            ]],
        },
    });
}

async function handleReviewRating(token: string, callback: TelegramCallbackQuery) {
    const match = (callback.data ?? "").match(/^review:(\d+):([1-5])$/);
    if (!match || !callback.message?.chat?.id || !callback.message.message_id) return;

    const originalMessageId = Number(match[1]);
    const rating = Number(match[2]);
    const chatId = callback.message.chat.id;
    if (String(chatId) !== readEnv("TELEGRAM_REVIEWS_CHAT_ID")) return;

    const key = `superbot:review:pending:${chatId}:${originalMessageId}`;
    const raw = await redisCommand(["GET", key]);
    if (!raw) {
        await telegramApi(token, "answerCallbackQuery", {
            callback_query_id: callback.id,
            text: "Этот отзыв уже обработан или устарел.",
            show_alert: true,
        });
        return;
    }

    const pending = JSON.parse(String(raw)) as PendingReview;
    const review = {
        id: pending.id,
        username: pending.username,
        text: pending.text,
        rating,
        date: pending.date,
    };

    await redisCommand(["LPUSH", "superbot:reviews", JSON.stringify(review)]);
    await redisCommand(["LTRIM", "superbot:reviews", "0", "49"]);
    await redisCommand(["DEL", key]);
    await telegramApi(token, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: `Спасибо! Оценка ${rating}/5 сохранена ⭐`,
    });
    await telegramApi(token, "editMessageText", {
        chat_id: chatId,
        message_id: callback.message.message_id,
        text: `⭐ <b>Оценка получена: ${"⭐".repeat(rating)}</b>\n\nСпасибо за ваш отзыв!`,
        parse_mode: "HTML",
    });
}

export default async function handler(
    req: { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> },
    res: { status: (code: number) => { json: (data: unknown) => void } },
) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const token = readEnv("TELEGRAM_BOT_TOKEN");
    const adminChatId = readEnv("TELEGRAM_ADMIN_CHAT_ID");
    const webhookSecret = readEnv("TELEGRAM_WEBHOOK_SECRET");
    if (!token || !adminChatId || !webhookSecret) {
        return res.status(500).json({ error: "Telegram environment variables are missing" });
    }

    const receivedSecret = req.headers?.["x-telegram-bot-api-secret-token"];
    const receivedSecretValue = Array.isArray(receivedSecret) ? receivedSecret[0] : receivedSecret;
    if (receivedSecretValue !== webhookSecret) return res.status(401).json({ error: "Unauthorized" });

    const update = req.body as TelegramUpdate | undefined;

    if (update?.callback_query?.data?.startsWith("review:")) {
        try {
            await handleReviewRating(token, update.callback_query);
        } catch (error) {
            console.error("review rating error:", error);
            if (update.callback_query.id) {
                await telegramApi(token, "answerCallbackQuery", {
                    callback_query_id: update.callback_query.id,
                    text: "Не удалось сохранить оценку. Проверьте настройки хранилища.",
                    show_alert: true,
                });
            }
        }
        return res.status(200).json({ ok: true });
    }

    const message = update?.message;
    if (!message?.chat?.id) return res.status(200).json({ ok: true });
    const messageText = message.text?.trim();

    if (message.chat.type === "private" && messageText && /^\/start(?:\s|$)/i.test(messageText)) {
        const result = await sendWelcome(token, message.chat.id, message.from?.first_name);
        if (!result.ok) console.error("telegram welcome error:", result.description);
        return res.status(200).json({ ok: result.ok });
    }

    if (message.chat.type === "private" && messageText) {
        const result = await forwardDirectMessage(token, adminChatId, message);
        if (!result.ok) console.error("telegram direct message forwarding error:", result.description);
        return res.status(200).json({ ok: result.ok });
    }

    if (String(message.chat.id) === readEnv("TELEGRAM_REVIEWS_CHAT_ID")) {
        try {
            await createPendingReview(token, message);
        } catch (error) {
            console.error("review creation error:", error);
        }
        return res.status(200).json({ ok: true });
    }

    if (String(message.chat.id) !== adminChatId || !messageText) return res.status(200).json({ ok: true });

    const source = message.reply_to_message?.text ?? message.reply_to_message?.caption ?? "";
    const clientId = source.match(/(?:^|\n)ID:\s*(\d+)/)?.[1];
    if (!clientId) return res.status(200).json({ ok: true });

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
