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

        try {
            let body = ""
            request.on("data", chunk => body += chunk.toString())
            request.on("end", async () => {
                response.writeHead(ResponseCodes.SUCCESS, this.responseHeaders)
                response.end()
                const requestData = [JSON.parse(body)]
                const queryData = await this.botProvider.handleUpdate(requestData)
                await this.commandHandler.handleQuery(queryData)
            })

        } catch (error) {
            response.writeHead(ResponseCodes.ERROR, this.responseHeaders)
            response.end()
            Logger.error("Ошибка: " + JSON.stringify(error))
        }
    }

    async start(): Promise<void> {

        await this.botProvider.init()

        if (this.botProvider.isUseWebhook()) {
            this.server.listen(this.port, () => Logger.log("Сервер запущен."))
        }
        else {
            this.getBotUpdates()
        }
    }

    stop(): void {
        this.server.close(() => Logger.log("Сервер остановлен."))
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
            console.log(queryData)
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