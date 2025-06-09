import {IWebRequestService} from "../../web-request.interface"
import {IBotProvider} from "../bot-provider.interface"
import {IModel} from "../../../model/model.interface"
import {Config} from "../../../config/config"
import {TelegramCommands} from "./telegram-commands"
import {TelegramBaseResponse} from "../../../data/telegram/telegram-base.response"
import {Logger} from "../../../utils/logger"
import {IQueryData} from "../../../data/query-data.interface"
import {TelegramQueryData} from "../../../data/telegram/telegram-query.data"
import {TelegramGetUpdatesResponse} from "../../../data/telegram/telegram-get-updates.response"

export class TelegramApiProvider implements IBotProvider {
    private readonly apiUrl: string
    private readonly token: string
    private readonly baseUrl: string
    private readonly webRequestService: IWebRequestService
    private readonly canUseWebhook: boolean
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