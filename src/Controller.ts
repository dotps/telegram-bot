import {IInputOutputService} from "./Services/IInputOutputService"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {ResponseData} from "./Data/ResponseData"
import {IModel} from "./Model/IModel"
import {Commands} from "./Commands/Commands"
import {ICurrencyService} from "./Services/Currency/ICurrencyService"

export class Controller {

    private readonly inputOutputService: IInputOutputService
    private commandFactory: ICommandFactory
    private currencyService: ICurrencyService
    private model: IModel
    private defaultResponse: string = "Неизвестная команда."

    constructor(model: IModel, inputOutputService: IInputOutputService, commandFactory: ICommandFactory, currencyService: ICurrencyService) {
        this.currencyService = currencyService
        this.model = model
        this.commandFactory = commandFactory
        this.inputOutputService = inputOutputService
    }

    async run() {

        while (this.model.isAppRunning()) {

            let responseData: ResponseData | null = null
            const queryData  = await this.inputOutputService.getQuery()
            let input = queryData.text.toLowerCase().trim()

            const currencies = this.currencyService.parseCurrencyCodes(input)
            if (currencies) {
                input = Commands.CURRENCY_RATIO
            }

            const command = this.commandFactory.createCommand(input)

            responseData = (command)
                ? await command.execute(currencies)
                : new ResponseData([this.defaultResponse])

            this.inputOutputService.sendResponse(responseData)
        }

        this.inputOutputService.close()
    }


}