import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { IncomingMessage, ServerResponse } from "http";

import {
    handleLeadSubmission,
    type LeadPayload,
} from "./lib/telegram";

const SHEET_ID =
    "1KWOuNVMAy3ol_zp7Kiv_dJq7rm_EHVYNm_Ns5hZZyzc";

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => resolve(data));
        req.on("error", reject);
    });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
}

function apiDevPlugin(env: Record<string, string>): Plugin {
    return {
        name: "superbot-api-dev",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url?.split("?")[0];

                if (url === "/api/send-lead" && req.method === "POST") {
                    try {
                        const body = await readBody(req);
                        const payload = JSON.parse(body) as LeadPayload;

                        await handleLeadSubmission(
                            payload,
                            env.TELEGRAM_BOT_TOKEN,
                            env.TELEGRAM_ADMIN_CHAT_ID,
                        );

                        sendJson(res, 200, { ok: true });
                    } catch (error) {
                        console.error(error);
                        sendJson(res, 500, {
                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to send lead",
                        });
                    }

                    return;
                }

                if (url === "/api/rates" && req.method === "GET") {
                    try {
                        const response = await fetch(
                            `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`,
                        );

                        const text = await response.text();
                        const json = JSON.parse(
                            text.substring(47, text.length - 2),
                        );

                        const rates: Record<
                            string,
                            {
                                rate: number;
                                vip: number;
                                minVip: number;
                            }
                        > = {};

                        json.table.rows.forEach((row: {
                            c?: Array<{ v?: string | number } | null>;
                        }) => {
                            const currency = row.c?.[0]?.v;
                            const rate = row.c?.[1]?.v;
                            const vip = row.c?.[2]?.v;
                            const minVip = row.c?.[3]?.v;

                            if (currency) {
                                rates[String(currency)] = {
                                    rate: Number(rate),
                                    vip: Number(vip),
                                    minVip: Number(minVip),
                                };
                            }
                        });

                        sendJson(res, 200, rates);
                    } catch (error) {
                        console.error(error);
                        sendJson(res, 500, {
                            error: "Failed to load rates",
                        });
                    }

                    return;
                }

                next();
            });
        },
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tailwindcss(), apiDevPlugin(env)],
    };
});
