import {IInputOutputService} from "./IInputOutputService"
import {createInterface, Interface} from "node:readline/promises"
import {ResponseData} from "../Data/ResponseData"
import {ConsoleQueryData} from "../Data/ConsoleQueryData"
import {IModel} from "../Model/IModel"
import {ICurrencyService} from "./Currency/ICurrencyService"
import {ICommandFactory} from "../Factory/ICommandFactory"
import {CommandHandler} from "../Commands/CommandHandler"
import {IQueryData} from "../Data/IQueryData"

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

    async getUpdates(): Promise<IQueryData> {
        const text = await this.readlineService.question(this.beforeCursorText)
        return new ConsoleQueryData({text: text})
    }

    async start(): Promise<void> {

        while (this.model.isAppRunning()) {
            const queryData = await this.getUpdates()
            await this.commandHandler.handleQuery(queryData)
        }

        this.stop()
    }

    stop(): void {
        this.readlineService.close()
    }

    async sendResponse(response: ResponseData | null): Promise<void> {
        if (!response) return

        const data = response?.data || []
        if (data.length !== 0) console.log("==============================================================")
        for (const text of data) {
            console.log(text)
        }
    }
}