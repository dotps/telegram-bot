import {IInputOutputService} from "./IInputOutputService"
import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"
import {createServer, IncomingMessage, Server, ServerResponse} from "node:http"
import {Logger} from "../Utils/Logger"

export class InputOutputHTTPService implements IInputOutputService {

    private server: Server
    private readonly port: number = 3000

    constructor(port?: number) {
        if (port) this.port = port
        this.server = createServer(this.handleRequest.bind(this))
        this.start()
    }

    async getQuery(): Promise<QueryData> {
        // const text = await this.ioService.question(this.beforeCursorText)
        return {
            text: "start"
        }
    }

    private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
        if (req.method === 'GET' && req.url?.startsWith('/query')) {
            try {
                // Парсим URL и извлекаем query-параметры
                const url = new URL(req.url, `http://${req.headers.host}`);
                const queryParams = url.searchParams;

                // Создаем объект QueryData из query-параметров
                const queryData: QueryData = {
                    text: queryParams.get('text') || '' // Пример: /query?text=Hello
                };

                // Обрабатываем запрос
                const responseData = await this.processQuery(queryData);

                // Отправляем ответ
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    }

    private async processQuery(queryData: QueryData): Promise<ResponseData> {
        // Имитация асинхронной обработки
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            data: [`Processed query: ${queryData.text}`]
        };
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log("Сервер запущен.")
        })
    }

    close(): void {
        this.server.close(() => {
            Logger.log("Сервер остановлен.")
        })
    }

    sendResponse(response: ResponseData): void {
        if (!response)
            return

        const data = response?.data || []
        for (const text of data) {
            console.log(text)
        }
    }
}