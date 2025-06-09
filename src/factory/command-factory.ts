import {Commands} from "../commands/commands"
import {ICommandFactory} from "./command-factory.interface"
import {IModel} from "../model/model.interface"
import {ICurrencyService} from "../services/Currency/currency-service.interface"
import {CommandData} from "../data/command.data"
import {ICommand} from "../commands/command.interface"
import {ExitCommand} from "../commands/exit.command"
import {StartCommand} from "../commands/start.command"
import {CurrencyCommand} from "../commands/currency.command"
import {CurrencyRatioCommand} from "../commands/currency-ratio.command"

export class CommandFactory implements ICommandFactory {
    private readonly model: IModel
    private readonly currencyService: ICurrencyService

    constructor(model: IModel, currencyService: ICurrencyService) {
        this.currencyService = currencyService
        this.model = model
    }

    createCommand(commandData: CommandData): ICommand | null {
        switch (commandData.input) {
            case Commands.EXIT:
                return new ExitCommand(this.model)
            case Commands.START:
                return new StartCommand()
            case Commands.CURRENCY:
                return new CurrencyCommand(this.currencyService)
            case Commands.CURRENCY_RATIO:
                const currencies = commandData?.params?.currencies || null
                return new CurrencyRatioCommand(this.currencyService, currencies)
            default:
                return null
        }
    }
}