import {IInputOutputService} from "./Services/IInputOutputService"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {ResponseData} from "./Data/ResponseData"
import {IModel} from "./Model/IModel"
import {Commands} from "./Commands/Commands"
import {ICurrencyService} from "./Services/Currency/ICurrencyService"
import {TelegramCommands} from "./Services/Bots/TelegramCommands"
import {IBotProvider} from "./Services/Bots/IBotProvider"
import {Logger} from "./Utils/Logger"

export class Controller {

    private readonly inputOutputService: IInputOutputService
    private commandFactory: ICommandFactory
    private botProvider: IBotProvider
    private currencyService: ICurrencyService
    private model: IModel
    private defaultResponse: string = "Неизвестная команда."

    constructor(model: IModel, inputOutputService: IInputOutputService, commandFactory: ICommandFactory, currencyService: ICurrencyService, botProvider: IBotProvider) {
        this.botProvider = botProvider
        this.currencyService = currencyService
        this.model = model
        this.commandFactory = commandFactory
        this.inputOutputService = inputOutputService
    }

    async run() {

        await this.botProvider.init()
        console.log(this.botProvider.getBotId())

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