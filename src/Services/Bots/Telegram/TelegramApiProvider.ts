import {IBotProvider} from "../IBotProvider"
import {IWebRequestService} from "../../IWebRequestService"
import {Logger} from "../../../Utils/Logger"
import {TelegramCommands} from "./TelegramCommands"
import {IModel} from "../../../Model/IModel"
import {TelegramBaseResponse} from "../../../Data/Telegram/TelegramBaseResponse"
import {TelegramGetUpdatesResponse} from "../../../Data/Telegram/TelegramGetUpdatesResponse"
import {TelegramQueryData} from "../../../Data/Telegram/TelegramQueryData"
import {IQueryData} from "../../../Data/IQueryData"
import {Config} from "../../../Config/Config"

export class TelegramApiProvider implements IBotProvider {
    private readonly apiUrl: string
    private readonly token: string
    private readonly baseUrl: string
    private readonly webRequestService: IWebRequestService
    private readonly canUseWebhook
    private readonly model: IModel
    private readonly webhookUrl: string | undefined
    private lastUpdateId: number = 0
    private readonly messages = {
        ERROR: "Telegram не ok: ",
        ERROR_INIT: "Бот не инициализирован.",
    } as const

    constructor(model: IModel, webRequestService: IWebRequestService) {
        this.model = model
        this.webRequestService = webRequestService
        this.webhookUrl = Config.TELEGRAM_WEBHOOK_URL
        this.token = Config.TELEGRAM_TOKEN || ""
        this.apiUrl = Config.TELEGRAM_API_URL || ""
        this.baseUrl = this.apiUrl + this.token + "/"
        this.canUseWebhook = (Config.TELEGRAM_USE_WEBHOOK)?.toLowerCase() === "true"
    }

    public async init(): Promise<void> {
        const response = await this.webRequestService.tryGet(this.baseUrl + TelegramCommands.GET_ME)
        const initResponse = new TelegramBaseResponse(response)
        if (initResponse.ok) {
            this.model.botWasInit()
            return
        }
        else {
            Logger.error(this.messages.ERROR_INIT)
        }
    }

    getWebhookUrl(): string | undefined {
        return this.webhookUrl
    }

    async sendResponse(text: string, queryData: IQueryData): Promise<void> {

        if (!this.model.isBotInit()) {
            Logger.log(this.messages.ERROR_INIT)
            return
        }

        if (queryData instanceof TelegramQueryData) {
            const url = `${this.baseUrl}${TelegramCommands.SEND_MESSAGE}?chat_id=${queryData.chatId}&text=${text}`
            const botResponse = await this.webRequestService.tryGet(url)
            const response = new TelegramBaseResponse(botResponse)
            if (!response?.ok) Logger.error(this.messages.ERROR + JSON.stringify(response))
        }
    }

    async getUpdates(): Promise<IQueryData> {

        let queryData = new TelegramQueryData()
        const offset = (this.lastUpdateId) ? `offset=${this.lastUpdateId + 1}&` : ``
        const botResponse = await this.webRequestService.tryGet(`${this.baseUrl}${TelegramCommands.GET_UPDATES}?${offset}`)
        const response = new TelegramBaseResponse(botResponse)

        if (response.ok) {
            queryData = await this.handleUpdate(response.result)
        }
        else {
            Logger.error(this.messages.ERROR + JSON.stringify(response))
        }

        return queryData
    }

    async handleUpdate(requestData: any): Promise<TelegramQueryData> {

        let queryData = new TelegramQueryData()
        const updateData = new TelegramGetUpdatesResponse(requestData)

        if (updateData) {
            const lastUpdate = updateData.getLastUpdate()
            if (lastUpdate) {
                this.lastUpdateId = lastUpdate.updateId
                queryData = new TelegramQueryData(lastUpdate)
            }
        }

        return queryData
    }

    isUseWebhook(): boolean {
        return this.canUseWebhook
    }
}

/*
{
    "ok": true,
    "result": [
        {
            "update_id": 362309960,
            "message": {
                "message_id": 197,
                "from": {
                    "id": 318745628,
                    "is_bot": false,
                    "first_name": "Имя",
                    "last_name": "Фамилия",
                    "username": "login",
                    "language_code": "ru"
                },
                "chat": {
                    "id": 318745628,
                    "first_name": "Имя",
                    "last_name": "Фамилия",
                    "username": "login",
                    "type": "private"
                },
                "date": 1742476287,
                "text": "/currency",
                "entities": [
                    {
                        "offset": 0,
                        "length": 6,
                        "type": "bot_command"
                    }
                ]
            }
        }
    ]
}
 */