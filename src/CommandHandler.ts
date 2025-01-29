import {IInputOutputService} from "./Services/IInputOutputService"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {ResponseData} from "./Data/ResponseData"
import {IModel} from "./Model/IModel"
import {Commands} from "./Commands/Commands"
import {ICurrencyService} from "./Services/Currency/ICurrencyService"
import {TelegramCommands} from "./Services/Bots/Telegram/TelegramCommands"
import {IBotProvider} from "./Services/Bots/IBotProvider"
import {Logger} from "./Utils/Logger"
import {IQueryData, ConsoleQueryData} from "./Data/ConsoleQueryData"

export class CommandHandler {

    private readonly inputOutputService: IInputOutputService
    private commandFactory: ICommandFactory
    private currencyService: ICurrencyService
    private defaultResponse: string = "Неизвестная команда."

    constructor(inputOutputService: IInputOutputService, commandFactory: ICommandFactory, currencyService: ICurrencyService) {
        this.currencyService = currencyService
        this.commandFactory = commandFactory
        this.inputOutputService = inputOutputService
    }

    async handleQuery(queryData: IQueryData) {

        let responseData: ResponseData | null
        let input = queryData.text.toLowerCase().trim()

        const currencies = this.currencyService.parseCurrencyCodes(input)
        if (currencies) input = Commands.CURRENCY_RATIO

        const commandData = new CommandData(input, {currencies: currencies})
        const command = this.commandFactory.createCommand(commandData)

        responseData = (command)
            ? await command.execute(currencies)
            : new ResponseData([this.defaultResponse])

        await this.inputOutputService.sendResponse(responseData, queryData)
    }

}

export class CommandData {
    input: string
    params: ICommandDataParams

    constructor(input: string, params: ICommandDataParams) {
        this.input = input
        this.params = params
    }
}

export interface ICommandDataParams {
    currencies: string[] | null
}