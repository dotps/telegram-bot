import {IInputOutputService} from "./Services/IInputOutputService"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {ResponseData} from "./Data/ResponseData"
import {IModel} from "./Model/IModel"
import {Commands} from "./Commands/Commands"
import {ICurrencyService} from "./Services/Currency/ICurrencyService"
import {TelegramCommands} from "./Services/Bots/TelegramCommands"
import {IBotProvider} from "./Services/Bots/IBotProvider"
import {Logger} from "./Utils/Logger"
import {QueryData} from "./Data/QueryData"

export class LogicController {

    private readonly inputOutputService: IInputOutputService
    private commandFactory: ICommandFactory
    private currencyService: ICurrencyService
    private defaultResponse: string = "Неизвестная команда."

    constructor(inputOutputService: IInputOutputService, commandFactory: ICommandFactory, currencyService: ICurrencyService) {
        this.currencyService = currencyService
        this.commandFactory = commandFactory
        this.inputOutputService = inputOutputService
    }

    async run(queryData: QueryData) {

        let responseData: ResponseData | null = null
        let input = queryData.text.toLowerCase().trim()

        // TODO: не нравится постоянная отправка currencies в command.execute(currencies) когда не надо
        const currencies = this.currencyService.parseCurrencyCodes(input)
        if (currencies) {
            input = Commands.CURRENCY_RATIO
        }

        const command = this.commandFactory.createCommand(input)

        responseData = (command)
            ? await command.execute(currencies)
            : new ResponseData([this.defaultResponse])

        await this.inputOutputService.sendResponse(responseData)
    }

}