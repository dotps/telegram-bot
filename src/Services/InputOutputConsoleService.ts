import {IInputOutputService} from "./IInputOutputService"
import {createInterface, Interface} from "node:readline/promises"
import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"
import {IModel} from "../Model/IModel"
import {Commands} from "../Commands/Commands"
import {ICurrencyService} from "./Currency/ICurrencyService"
import {ICommandFactory} from "../Factory/ICommandFactory"
import {LogicController} from "../LogicController"

export class InputOutputConsoleService implements IInputOutputService {

    private readlineService: Interface
    private commandFactory: ICommandFactory
    private currencyService: ICurrencyService
    private model: IModel
    private beforeCursorText: string = "> "
    // private defaultResponse: string = "Неизвестная команда."
    private controller: LogicController

    constructor(model:IModel, currencyService: ICurrencyService, commandFactory: ICommandFactory) {
        this.commandFactory = commandFactory
        this.currencyService = currencyService
        this.model = model
        this.controller = new LogicController(this, commandFactory, currencyService)
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

            let responseData: ResponseData | null = null
            const queryData = await this.getQuery()

            await this.controller.run(queryData)

            /*
            let input = queryData.text.toLowerCase().trim()

            // TODO: нужно логику вынести в общий метод для различных сервисов http/console, возможно даже пересмотреть ее
            // не нравится постоянная отправка currencies в command.execute(currencies) когда не надо
            const currencies = this.currencyService.parseCurrencyCodes(input)
            if (currencies) {
                input = Commands.CURRENCY_RATIO
            }

            const command = this.commandFactory.createCommand(input)

            responseData = (command)
                ? await command.execute(currencies)
                : new ResponseData([this.defaultResponse])

            this.sendResponse(responseData)*/
        }

        this.close()
    }

    close(): void {
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