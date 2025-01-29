// export type QueryData = {
//     text: string
// }

export class TelegramQueryData implements IQueryData {
    text: string
    updateId: number
    chatId: number

    constructor(data?: any) {
        this.text = data?.text || ""
        this.updateId = data?.updateId || 0
        this.chatId = data?.chatId || 0
    }
}

export class ConsoleQueryData implements IQueryData {
    text: string

    constructor(data?: any) {
        this.text = data?.text || ""
    }
}

export interface IQueryData {
    text: string
}