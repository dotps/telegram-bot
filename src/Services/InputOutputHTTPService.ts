import {IInputOutputService} from "./IInputOutputService"
import {ResponseData} from "../Data/ResponseData"
import {createServer, IncomingMessage, OutgoingHttpHeaders, Server, ServerResponse} from "node:http"
import {Logger} from "../Utils/Logger"
import {IBotProvider} from "./Bots/IBotProvider"
import {ICurrencyService} from "./Currency/ICurrencyService"
import {ICommandFactory} from "../Factory/ICommandFactory"
import {CommandHandler} from "../Commands/CommandHandler"
import {IQueryData} from "../Data/IQueryData"

export class InputOutputHTTPService implements IInputOutputService {

    private readonly port: number = 3000
    private readonly queryMethod: string = "/query"
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
    }

    private async handlePostRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
        if (request.method !== "POST" || !request.url?.startsWith(this.queryMethod)) {
            response.writeHead(ResponseCodes.NOT_FOUND, this.responseHeaders)
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

                response.writeHead(ResponseCodes.SUCCESS, this.responseHeaders)
                response.end()
            } catch (error) {
                if (!response.headersSent) response.writeHead(ResponseCodes.ERROR, this.responseHeaders)
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
            const queryData = await this.botProvider.getUpdates()
            if (!queryData.text) return
            await this.commandHandler.handleQuery(queryData)
        }, this.updateInterval)
    }
}

export enum ResponseCodes {
    SUCCESS = 200,
    NOT_FOUND = 404,
    ERROR = 500,
}