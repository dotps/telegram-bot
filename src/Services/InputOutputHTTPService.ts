import {IInputOutputService} from "./IInputOutputService"
import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"
import {createServer, IncomingMessage, Server, ServerResponse} from "node:http"
import {Logger} from "../Utils/Logger"
import {IBotProvider} from "./Bots/IBotProvider"

export class InputOutputHTTPService implements IInputOutputService {

    private server: Server
    private botProvider: IBotProvider
    private readonly port: number = 3000

    constructor(botProvider: IBotProvider) {
        this.botProvider = botProvider
        this.server = createServer(this.handleRequest.bind(this))
    }

    private async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {

        // TODO: реализовать обработку запросов сервером

        if (request.method === 'GET' && request.url?.startsWith('/query')) {
            try {
                // Парсим URL и извлекаем query-параметры
                const url = new URL(request.url, `http://${request.headers.host}`)
                const queryParams = url.searchParams

                // Создаем объект QueryData из query-параметров
                const queryData: QueryData = {
                    text: queryParams.get('text') || '' // Пример: /query?text=Hello
                }

                // Обрабатываем запрос
                const responseData = await this.processQuery(queryData)

                // Отправляем ответ
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify(responseData))
            } catch (error) {
                response.writeHead(500, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ error: 'Internal Server Error' }))
            }
        } else {
            response.writeHead(404, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ error: 'Not Found' }))
        }
    }

    private async processQuery(queryData: QueryData): Promise<ResponseData> {
        // Имитация асинхронной обработки
        await new Promise(resolve => setTimeout(resolve, 1000))

        return {
            data: [`Processed query: ${queryData.text}`]
        }
    }

    async start(): Promise<void> {

        await this.botProvider.init()

        this.server.listen(this.port, () => {
            Logger.log("Сервер запущен.")
        })
    }

    close(): void {
        this.server.close(() => {
            Logger.log("Сервер остановлен.")
        })
    }
}