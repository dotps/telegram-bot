import {IInputOutputService} from "./Services/IInputOutputService"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {ResponseData} from "./Data/ResponseData"
import {IModel} from "./Model/IModel"
import {Commands} from "./Commands/Commands"
import {ICurrencyService} from "./Services/Currency/ICurrencyService"
import {TelegramCommands} from "./Services/Bots/Telegram/TelegramCommands"
import {IBotProvider} from "./Services/Bots/IBotProvider"
import {Logger} from "./Utils/Logger"

export class Controller {

    private readonly inputOutputService: IInputOutputService
    private commandFactory: ICommandFactory
    private botProvider: IBotProvider
    private currencyService: ICurrencyService
    private model: IModel

    constructor(model: IModel, inputOutputService: IInputOutputService, commandFactory: ICommandFactory, currencyService: ICurrencyService, botProvider: IBotProvider) {
        this.botProvider = botProvider
        this.currencyService = currencyService
        this.model = model
        this.commandFactory = commandFactory
        this.inputOutputService = inputOutputService
    }

    async run() {

        // await this.botProvider.init()
        this.inputOutputService.start()

    }


}