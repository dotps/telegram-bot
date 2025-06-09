import {IInputOutputService} from "../services/input-output.interface"
import {ICommandFactory} from "../factory/command-factory.interface"
import {ICurrencyService} from "../services/Currency/currency-service.interface"
import {IQueryData} from "../data/query-data.interface"
import {ResponseData} from "../data/response.data"
import {Commands} from "./commands"
import {CommandData} from "../data/command.data"

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
        if (currencies) input = Commands.CurrencyRatio

        const commandData = new CommandData(input, {currencies: currencies})
        const command = this.commandFactory.createCommand(commandData)

        responseData = (command)
            ? await command.execute(currencies)
            : new ResponseData([this.defaultResponse])

        await this.inputOutputService.sendResponse(responseData, queryData)
    }

}

