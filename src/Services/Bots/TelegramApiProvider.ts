import {IBotProvider} from "./IBotProvider"
import {IWebRequestService} from "../IWebRequestService"
import {Logger} from "../../Utils/Logger"
import {TelegramCommands} from "./TelegramCommands"
import {IModel} from "../../Model/IModel"
import {QueryData} from "../../Data/QueryData"
import {Commands} from "../../Commands/Commands"
import {ResponseData} from "../../Data/ResponseData"

export class TelegramApiProvider implements IBotProvider {

    private readonly apiUrl: string = "https://api.telegram.org/bot"
    private readonly token: string = "7727862535:AAGq0VKfRaOeXCPB5v1R02ct8IydXDslt-c"
    private model: IModel
    private readonly baseUrl: string = this.apiUrl + this.token + "/"
    private readonly webRequestService: IWebRequestService
    private readonly myId: number = 318745628
    private botId: number = 0
    private lastUpdateId: number = 0

    constructor(model: IModel, webRequestService: IWebRequestService) {
        this.model = model
        this.webRequestService = webRequestService
    }

    public async init(): Promise<void> {
        const response = await this.webRequestService.tryGet(this.baseUrl + TelegramCommands.GET_ME)
        const initResponse = new TelegramInitResponse(response)
        if (initResponse.ok) {
            this.botId = initResponse.result.id
            this.model.botWasInit()
            return
        }
        else {
            Logger.error("Не удалось инициализировать бота.")
        }
    }

    getBotId(): number {
        return this.botId
    }

    async sendResponse(text: string): Promise<void> {
        if (!this.model.isBotInit()) {
            Logger.log("Бот не инициализирован.")
            return
        }
        const url = `${this.baseUrl}${TelegramCommands.SEND_MESSAGE}?chat_id=${this.myId}&text=${text}`
        const botResponse = await this.webRequestService.tryGet(url)
    }

    async getUpdates(): Promise<QueryData> {
        const offset = (this.lastUpdateId) ? `offset=${this.lastUpdateId + 1}&` : ``
        const botResponse = await this.webRequestService.tryGet(`${this.baseUrl}${TelegramCommands.GET_UPDATES}?${offset}`)
        let queryData: QueryData = {
            text: ""
        }
        console.log(botResponse?.ok)
        if (botResponse?.ok) {
            const updatesResponse = new TelegramGetUpdatesResponse(botResponse?.result)
            if (updatesResponse) {
                const lastUpdate = updatesResponse.getLastUpdate()
                if (lastUpdate) {
                    this.lastUpdateId = lastUpdate.updateId
                    queryData = {
                        text: lastUpdate.text
                    }
                }
            }
            // console.log(updatesResponse)
            // console.log(updatesResponse.getLastUpdateId())
        }

        if (queryData.text) {
            // TODO: подключить метод парсинга команды и запуска команд
            console.log(queryData)
        }

        return queryData
    }
}

export class TelegramInitResponse {
    public ok: boolean
    public result: {
        id: number
    }

    constructor(response: any) {
        this.ok = response?.ok
        this.result = response?.result
    }

}

export class TelegramGetUpdatesResponse {

    updates: TelegramUpdateData[]

    constructor(data: any) {

        if (!Array.isArray(data)) {
            this.updates = []
            return
        }

        this.updates = data.map(update => ({
            updateId: update.update_id || 0,
            text: update.message?.text || ""
        }))
    }

    getLastUpdateId(): number {
        if (this.updates.length === 0) return 0
        return this.updates[this.updates.length - 1].updateId
    }

    getLastUpdate(): TelegramUpdateData | null {
        // return this.updates[this.getLastUpdateId()]
        if (this.updates.length === 0) return null
        return this.updates[this.updates.length - 1]
    }
}

type TelegramUpdateData = {
    updateId: number
    text: string
}

