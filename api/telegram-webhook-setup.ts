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
        return JSON.parse(raw) as { ok: boolean; description?: string; result?: any };
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
    const reviewsChatId = readEnv("TELEGRAM_REVIEWS_CHAT_ID");
    const querySecret = req.query?.secret;
    const querySecretValue = Array.isArray(querySecret) ? querySecret[0] : querySecret;

    if (!token || !secret || !reviewsChatId) {
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

    const [info, me, chatByConfiguredId, chatByUsername] = await Promise.all([
        telegramApi(token, "getWebhookInfo", {}),
        telegramApi(token, "getMe", {}),
        telegramApi(token, "getChat", { chat_id: reviewsChatId }),
        telegramApi(token, "getChat", { chat_id: "@superbot_reviews" }),
    ]);

    const botId = me.ok ? me.result?.id : undefined;
    const resolvedChatId = chatByUsername.ok ? chatByUsername.result?.id : undefined;
    const memberChatId = resolvedChatId ?? reviewsChatId;
    const member = botId
        ? await telegramApi(token, "getChatMember", { chat_id: memberChatId, user_id: botId })
        : { ok: false, description: "Could not determine bot id" };

    return res.status(200).json({
        ok: true,
        webhook: info.result,
        checks: {
            bot: me.ok
                ? { ok: true, id: me.result?.id, username: me.result?.username, can_read_all_group_messages: me.result?.can_read_all_group_messages }
                : { ok: false, error: me.description },
            reviews_chat: chatByConfiguredId.ok
                ? { ok: true, id: chatByConfiguredId.result?.id, type: chatByConfiguredId.result?.type, title: chatByConfiguredId.result?.title, username: chatByConfiguredId.result?.username }
                : {
                    ok: false,
                    error: chatByConfiguredId.description,
                    configured_id: reviewsChatId,
                    resolved_by_username: chatByUsername.ok
                        ? { id: chatByUsername.result?.id, type: chatByUsername.result?.type, title: chatByUsername.result?.title, username: chatByUsername.result?.username }
                        : { error: chatByUsername.description },
                },
            bot_membership: member.ok
                ? { ok: true, chat_id_checked: memberChatId, status: member.result?.status, can_manage_chat: member.result?.can_manage_chat, can_delete_messages: member.result?.can_delete_messages, can_pin_messages: member.result?.can_pin_messages }
                : { ok: false, chat_id_checked: memberChatId, error: member.description },
        },
    });
}
