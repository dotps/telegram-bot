import {ICommand} from "../Commands/ICommand"
import {Commands} from "../Commands/Commands"
import {StartCommand} from "../Commands/StartCommand"
import {ExitCommand} from "../Commands/ExitCommand"
import {ICommandFactory} from "./ICommandFactory"
import {IModel} from "../Model/IModel"
import {CurrencyCommand} from "../Commands/CurrencyCommand"
import {CurrencyService} from "../Services/Currency/CurrencyService"
import {CurrencyPairCommand} from "../Commands/CurrencyPairCommand"

export class CommandFactory implements ICommandFactory {
    private readonly model: IModel
    private currencyService: CurrencyService

    constructor(model: IModel, currencyService: CurrencyService) {
        this.currencyService = currencyService
        this.model = model
    }

    createCommand(command: string): ICommand | null {
        switch (command) {
            case Commands.EXIT:
                return new ExitCommand(this.model)
            case Commands.START:
                return new StartCommand()
            case Commands.CURRENCY:
                return new CurrencyCommand()
            case Commands.CURRENCY_PAIR:
                return new CurrencyPairCommand(this.currencyService)
            default:
                return null
        }
    }
}