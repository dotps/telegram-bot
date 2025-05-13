import * as dotenv from "dotenv"

dotenv.config()

export const Config = {
    APP_PORT: process.env.APP_PORT,
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
    TELEGRAM_USE_WEBHOOK: process.env.TELEGRAM_USE_WEBHOOK,
    TELEGRAM_API_URL: process.env.TELEGRAM_API_URL,
    TELEGRAM_QUERY_METHOD: process.env.TELEGRAM_QUERY_METHOD,
}