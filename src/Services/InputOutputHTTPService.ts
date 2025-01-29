import {IInputOutputService} from "./IInputOutputService"
import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"
import {createServer, IncomingMessage, Server, ServerResponse} from "node:http"
import {Logger} from "../Utils/Logger"
import {IBotProvider} from "./Bots/IBotProvider"
import {ICurrencyService} from "./Currency/ICurrencyService"
import {ICommandFactory} from "../Factory/ICommandFactory"
import {CommandHandler} from "../CommandHandler"

export class InputOutputHTTPService implements IInputOutputService {

    private server: Server
    private botProvider: IBotProvider
    private readonly port: number = 3000
    private readonly queryMethod: string = "/query"
    private commandHandler: CommandHandler
    private updateInterval: number = 5000

    constructor(botProvider: IBotProvider, currencyService: ICurrencyService, commandFactory: ICommandFactory) {
        this.botProvider = botProvider
        this.server = createServer(this.handleGetRequest.bind(this))
        this.commandHandler = new CommandHandler(this, commandFactory, currencyService)
    }

    private async handleGetRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {

        const responseData = new ResponseData()

        if (request.method !== "GET" || !request.url?.startsWith(this.queryMethod)) {
            responseData.data.push("Ошибка!")
            response.writeHead(404, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(responseData))
            return
        }

        try {
            // Парсим URL и извлекаем query-параметры
            const url = new URL(request.url, `http://${request.headers.host}`)
            console.log(url)
            const queryParams = url.searchParams
            console.log(queryParams)

            // Создаем объект QueryData из query-параметров
            const queryData: QueryData = {
                text: queryParams.get("text") || '' // Пример: /query?text=Hello
            }
            console.log(queryData)

            // Обрабатываем запрос
            const responseData = await this.processQuery(queryData)

            // Отправляем ответ
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(responseData))
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ error: 'Internal Server Error' }))
        }

    }

    private async processQuery(queryData: QueryData): Promise<ResponseData> {
        return {
            data: [`Processed query: ${queryData.text}`]
        }
    }

    async start(): Promise<void> {

        await this.botProvider.init()

        this.server.listen(this.port, () => {
            Logger.log("Сервер запущен.")
        })

        this.getBotUpdates()
    }

    stop(): void {
        this.server.close(() => {
            Logger.log("Сервер остановлен.")
        })
    }

    async sendResponse(response: ResponseData | null): Promise<void> {
        if (!response) return

        const data = response?.data || []
        for (const text of data) {
            await this.botProvider.sendResponse(text)
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

class TelegramUpdatePostResponse {
    updateId: number
    text: string

    constructor(data: any) {
        this.updateId = data?.update_id || 0
        this.text = data?.message?.text || ""
    }
}

