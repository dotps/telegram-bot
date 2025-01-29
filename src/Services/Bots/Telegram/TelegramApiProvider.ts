import {IBotProvider} from "../IBotProvider"
import {IWebRequestService} from "../../IWebRequestService"
import {Logger} from "../../../Utils/Logger"
import {TelegramCommands} from "./TelegramCommands"
import {IModel} from "../../../Model/IModel"
import {TelegramBaseResponse} from "../../../Data/Telegram/TelegramBaseResponse"
import {TelegramGetUpdatesResponse} from "../../../Data/Telegram/TelegramGetUpdatesResponse"
import {TelegramQueryData} from "../../../Data/Telegram/TelegramQueryData"
import {IQueryData} from "../../../Data/IQueryData"

export class TelegramApiProvider implements IBotProvider {

    private readonly apiUrl: string = "https://api.telegram.org/bot"
    private readonly token: string = "7727862535:AAGq0VKfRaOeXCPB5v1R02ct8IydXDslt-c"
    private model: IModel
    private readonly baseUrl: string = this.apiUrl + this.token + "/"
    private readonly webRequestService: IWebRequestService
    private botId: number = 0
    private lastUpdateId: number = 0
    private errorMessage: string = "Telegram не ok: "

    constructor(model: IModel, webRequestService: IWebRequestService) {
        this.model = model
        this.webRequestService = webRequestService
    }



    public async init(): Promise<void> {
        const response = await this.webRequestService.tryGet(this.baseUrl + TelegramCommands.GET_ME)
        const initResponse = new TelegramBaseResponse(response)
        if (initResponse.ok) {
            this.botId = initResponse.result.id
            this.model.botWasInit()
            return
        }
        else {
            Logger.error("Не удалось инициализировать бота.")
        }
    }

    async sendResponse(text: string, queryData: IQueryData): Promise<void> {

        if (!this.model.isBotInit()) {
            Logger.log("Бот не инициализирован.")
            return
        }

        if (queryData instanceof TelegramQueryData) {
            const url = `${this.baseUrl}${TelegramCommands.SEND_MESSAGE}?chat_id=${queryData.chatId}&text=${text}`
            const botResponse = await this.webRequestService.tryGet(url)
            const response = new TelegramBaseResponse(botResponse)
            if (!response?.ok) Logger.error(this.errorMessage + JSON.stringify(response))
        }
    }

    async getUpdates(): Promise<IQueryData> {

        let queryData = new TelegramQueryData()
        const offset = (this.lastUpdateId) ? `offset=${this.lastUpdateId + 1}&` : ``
        const botResponse = await this.webRequestService.tryGet(`${this.baseUrl}${TelegramCommands.GET_UPDATES}?${offset}`)
        const response = new TelegramBaseResponse(botResponse)

        if (response.ok) {
            const updatesResponse = new TelegramGetUpdatesResponse(response.result)
            if (updatesResponse) {
                const lastUpdate = updatesResponse.getLastUpdate()
                if (lastUpdate) {
                    this.lastUpdateId = lastUpdate.updateId
                    queryData = new TelegramQueryData(lastUpdate)
                }
            }
        }
        else {
            Logger.error(this.errorMessage + JSON.stringify(response))
        }

        return queryData
    }

    async handleUpdate(requestData: any): Promise<IQueryData> {
        const updateData = new TelegramGetUpdatesResponse(requestData)
        let queryData = new TelegramQueryData()

        if (updateData) {
            const lastUpdate = updateData.getLastUpdate()
            if (lastUpdate) {
                this.lastUpdateId = lastUpdate.updateId
                queryData = new TelegramQueryData(lastUpdate)
            }
        }

        return queryData
    }
}

