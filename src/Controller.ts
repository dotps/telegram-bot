import {IInputOutputService} from "./Services/IInputOutputService"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {ResponseData} from "./Data/ResponseData"
import {IModel} from "./Model/IModel"
import {CurrencyService} from "./Services/Currency/CurrencyService"

export class Controller {
    private readonly inputOutputService: IInputOutputService
    private commandFactory: ICommandFactory
    private currencyService: CurrencyService
    private model: IModel
    private defaultResponseData: ResponseData = {data: [`Неизвестная команда.`]}

    constructor(model: IModel, inputOutputService: IInputOutputService, commandFactory: ICommandFactory, currencyService: CurrencyService) {
        this.currencyService = currencyService
        this.model = model
        this.commandFactory = commandFactory
        this.inputOutputService = inputOutputService
    }

    async run() {

        while (this.model.isAppRunning()) {

            let input  = await this.inputOutputService.getQuery()
            input = input.toLowerCase().trim()

            const currencies = this.currencyService.parseCurrencyCodes(input)
            console.log(currencies)
            if (currencies) {
                this.model.setCurrencies(currencies)
            }

            let responseData = {}

            const command = this.commandFactory.createCommand(input)
            responseData = command ? command.execute() : this.defaultResponseData

            this.inputOutputService.sendResponse(responseData)
        }

        this.inputOutputService.close()
    }


}