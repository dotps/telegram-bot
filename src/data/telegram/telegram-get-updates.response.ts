import {ITelegramUpdateData} from "./telegram-update.data"

export class TelegramGetUpdatesResponse {

    updates: ITelegramUpdateData[]

    constructor(data: any) {

        if (!Array.isArray(data)) {
            this.updates = []
            return
        }

        this.updates = data.map(update => ({
            updateId: update.update_id || 0,
            chatId: update.message?.chat?.id || 0,
            text: update.message?.text || ""
        }))
    }

    getLastUpdate(): ITelegramUpdateData | null {
        if (this.updates.length === 0) return null
        return this.updates[this.updates.length - 1]
    }
}