import {createServer, IncomingMessage, OutgoingHttpHeaders, Server, ServerResponse} from "node:http"
import {IBotProvider} from "./Bots/bot-provider.interface"
import {CommandHandler} from "../commands/command-handler"
import {IInputOutputService} from "./input-output.interface"
import {ICurrencyService} from "./Currency/currency-service.interface"
import {ICommandFactory} from "../factory/command-factory.interface"
import {Config} from "../config/config"
import {Logger} from "../utils/logger"
import {ResponseData} from "../data/response.data"
import {IQueryData} from "../data/query-data.interface"

export class InputOutputHTTPService implements IInputOutputService {
    private readonly port: number = 3000
    private readonly webhookUrl: string = "/query"
    private readonly server: Server
    private readonly botProvider: IBotProvider
    private readonly commandHandler: CommandHandler
    private readonly updateInterval: number = 5000
    private readonly responseHeaders: OutgoingHttpHeaders = {"Content-Type": "application/json"}
    private readonly messages = {
        SERVER_START: "Сервер запущен. Порт: ",
        SERVER_STOP: "Сервер остановлен.",
        ERROR: "Ошибка: ",
    } as const

    constructor(botProvider: IBotProvider, currencyService: ICurrencyService, commandFactory: ICommandFactory) {
        this.botProvider = botProvider
        this.server = createServer(this.handlePostRequest.bind(this))
        this.commandHandler = new CommandHandler(this, commandFactory, currencyService)
        this.port = Number(Config.APP_PORT) ?? this.port
        this.webhookUrl = this.botProvider.getWebhookUrl() ?? this.webhookUrl
    }

    private async handlePostRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
        if (request.method !== "POST" || !request.url?.startsWith(this.webhookUrl)) {
            response.writeHead(ResponseCodes.NotFound, this.responseHeaders)
            response.end()
            return
        }

        let body = ""
        request.on("data", chunk => body += chunk.toString())
        request.on("end", async () => {
            try {
                const requestData = JSON.parse(body)

                if (requestData.ok) {
                    const queryData = await this.botProvider.handleUpdate(requestData.result)
                    await this.commandHandler.handleQuery(queryData)
                }
                else {
                    Logger.error(this.messages.ERROR + JSON.stringify(requestData))
                }

                response.writeHead(ResponseCodes.Success, this.responseHeaders)
                response.end()
            } catch (error) {
                if (!response.headersSent) response.writeHead(ResponseCodes.Error, this.responseHeaders)
                response.end()
                Logger.error(this.messages.ERROR + JSON.stringify(error))
            }
        })
    }

    async start(): Promise<void> {

        await this.botProvider.init()

        if (this.botProvider.isUseWebhook()) {
            this.server.listen(this.port, () => Logger.log(this.messages.SERVER_START + this.port))
        }
        else {
            this.getBotUpdates()
        }
    }

    stop(): void {
        this.server.close(() => Logger.log(this.messages.SERVER_STOP))
    }

    async sendResponse(response: ResponseData | null, queryData: IQueryData): Promise<void> {
        if (!response) return

        const data = response?.data || []
        for (const text of data) {
            await this.botProvider.sendResponse(text, queryData)
        }
    }

    private getBotUpdates() {
        setInterval(async () => {
            try {
                const queryData = await this.botProvider.getUpdates()
                if (!queryData.text) return
                await this.commandHandler.handleQuery(queryData)
            } catch (error) {
                Logger.error(this.messages.ERROR + JSON.stringify(error))
            }
        }, this.updateInterval)
    }
}

export enum ResponseCodes {
    Success = 200,
    NotFound = 404,
    Error = 500,
}