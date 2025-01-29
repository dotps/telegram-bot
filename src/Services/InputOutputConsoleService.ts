import {IInputOutputService} from "./IInputOutputService"
import {createInterface, Interface} from "node:readline/promises"
import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"
import {IModel} from "../Model/IModel"
import {Commands} from "../Commands/Commands"
import {ICurrencyService} from "./Currency/ICurrencyService"
import {ICommandFactory} from "../Factory/ICommandFactory"
import {CommandHandler} from "../CommandHandler"

export class InputOutputConsoleService implements IInputOutputService {

    private readonly readlineService: Interface
    private readonly model: IModel
    private readonly commandHandler: CommandHandler
    private beforeCursorText: string = "> "

    constructor(model:IModel, currencyService: ICurrencyService, commandFactory: ICommandFactory) {
        this.model = model
        this.commandHandler = new CommandHandler(this, commandFactory, currencyService)
        this.readlineService = createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    async getQuery(): Promise<QueryData> {
        const text = await this.readlineService.question(this.beforeCursorText)
        return {
            text: text
        }
    }

    async start(): Promise<void> {

        while (this.model.isAppRunning()) {
            const queryData = await this.getQuery()
            await this.commandHandler.handleQuery(queryData)
        }

        this.stop()
    }

    stop(): void {
        this.readlineService.close()
    }

    async sendResponse(response: ResponseData | null): Promise<void> {
        if (!response)
            return

        const data = response?.data || []
        for (const text of data) {
            console.log(text)
        }
    }
}