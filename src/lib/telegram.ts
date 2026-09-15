import { init, miniApp, themeParams } from "@telegram-apps/sdk";

export interface TelegramUserInfo {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
}

let initialized = false;

export function initTelegramApp() {
    if (initialized) return;

    try {
        init();

        if (miniApp.mount.isAvailable()) {
            miniApp.mount();
        }

        if (miniApp.ready.isAvailable()) {
            miniApp.ready();
        }

        window.Telegram?.WebApp?.expand?.();

        if (themeParams.mount.isAvailable()) {
            themeParams.mount();
        }

        initialized = true;
    } catch {
        // Not running inside Telegram Mini App
    }
}

export function getTelegramUser(): TelegramUserInfo | undefined {
    const webAppUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (webAppUser) {
        return {
            id: webAppUser.id,
            first_name: webAppUser.first_name,
            last_name: webAppUser.last_name,
            username: webAppUser.username,
        };
    }

    return undefined;
}

export function getBotUsername(): string {
    return import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";
}

export function openTelegramChat(message?: string) {
    const username = getBotUsername();

    if (!username) {
        console.warn("VITE_TELEGRAM_BOT_USERNAME is not set");
        return;
    }

    const url = message
        ? `https://t.me/${username}?text=${encodeURIComponent(message)}`
        : `https://t.me/${username}`;

    if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
    } else {
        window.open(url, "_blank");
    }
}

export function hapticFeedback(type: "success" | "error" | "light" = "light") {
    const haptic = window.Telegram?.WebApp?.HapticFeedback;

    if (!haptic) return;

    if (type === "success") {
        haptic.notificationOccurred("success");
    } else if (type === "error") {
        haptic.notificationOccurred("error");
    } else {
        haptic.impactOccurred("light");
    }
}

declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                initData?: string;
                initDataUnsafe?: {
                    user?: TelegramUserInfo;
                };
                ready: () => void;
                expand: () => void;
                openTelegramLink: (url: string) => void;
                HapticFeedback?: {
                    notificationOccurred: (
                        type: "success" | "error" | "warning",
                    ) => void;
                    impactOccurred: (
                        type: "light" | "medium" | "heavy",
                    ) => void;
                };
            };
        };
    }
}
