import {IBotProvider} from "./IBotProvider"
import {IWebRequestService} from "../IWebRequestService"
import {Logger} from "../../Utils/Logger"
import {TelegramCommands} from "./TelegramCommands"
import {IModel} from "../../Model/IModel"

export class TelegramApiProvider implements IBotProvider {


    private readonly apiUrl: string = "https://api.telegram.org/bot"
    private readonly token: string = "7727862535:AAGq0VKfRaOeXCPB5v1R02ct8IydXDslt-c"
    private model: IModel
    private readonly baseUrl: string = this.apiUrl + this.token + "/"
    private readonly webRequestService: IWebRequestService
    private botId: number = 0

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

    async sendResponse(command: string): Promise<void> {
        if (!this.model.isBotInit()) {
            Logger.log("Бот не инициализирован.")
            return
        }
        console.log(command)
        const botResponse = await this.webRequestService.tryGet(this.baseUrl + command)
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

