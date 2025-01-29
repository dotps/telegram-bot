import {ICommand} from "../Commands/ICommand"
import {Commands} from "../Commands/Commands"
import {StartCommand} from "../Commands/StartCommand"
import {ExitCommand} from "../Commands/ExitCommand"
import {ICommandFactory} from "./ICommandFactory"
import {IModel} from "../Model/IModel"
import {CurrencyCommand} from "../Commands/CurrencyCommand"
import {CurrencyRatioCommand} from "../Commands/CurrencyRatioCommand"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"

import {CommandData} from "../Data/CommandData"

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