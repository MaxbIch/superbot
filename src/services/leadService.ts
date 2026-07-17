import { getTelegramUser } from "../lib/telegram";
import type { LeadPayload } from "../../lib/telegram";

export type { LeadPayload };

export async function submitLead(
    payload: Omit<LeadPayload, "user">,
): Promise<void> {
    const response = await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...payload,
            user: getTelegramUser(),
        } satisfies LeadPayload),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
            data.error || "Не удалось отправить заявку",
        );
    }
}
