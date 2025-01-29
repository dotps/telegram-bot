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

    private server: Server
    private botProvider: IBotProvider
    private readonly port: number = 3000
    private readonly queryMethod: string = "/query"
    private commandHandler: CommandHandler
    private updateInterval: number = 5000
    private responseHeaders: OutgoingHttpHeaders = {"Content-Type": "application/json"}

    constructor(botProvider: IBotProvider, currencyService: ICurrencyService, commandFactory: ICommandFactory) {
        this.botProvider = botProvider
        this.server = createServer(this.handlePostRequest.bind(this))
        this.commandHandler = new CommandHandler(this, commandFactory, currencyService)
        // TODO: CommandHandler можно перенести в провайдеров бота
    }

    private async handlePostRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {

        if (request.method !== "POST" || !request.url?.startsWith(this.queryMethod)) {
            response.writeHead(ResponseCodes.NOT_FOUND, this.responseHeaders)
            response.end()
            return
        }

        try {

            let body = ''

            request.on('data', chunk => {
                body += chunk.toString()
            })

            request.on('end', async () => {

                response.writeHead(ResponseCodes.SUCCESS, this.responseHeaders)
                response.end()

                const requestData = [JSON.parse(body)]
                const queryData = await this.botProvider.handleUpdate(requestData)
                await this.commandHandler.handleQuery(queryData)
            })

        } catch (error) {
            response.writeHead(ResponseCodes.ERROR, this.responseHeaders)
            response.end()
        }
    }

    async start(): Promise<void> {

        await this.botProvider.init()

        this.server.listen(this.port, () => {
            Logger.log("Сервер запущен.")
        })

        // this.getBotUpdates()
    }

    stop(): void {
        this.server.close(() => {
            Logger.log("Сервер остановлен.")
        })
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