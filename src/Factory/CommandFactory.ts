import {ICommand} from "../Commands/ICommand"
import {Commands} from "../Commands/Commands"
import {StartCommand} from "../Commands/StartCommand"
import {ExitCommand} from "../Commands/ExitCommand"
import {ICommandFactory} from "./ICommandFactory"
import {IModel} from "../Model/IModel"
import {CurrencyCommand} from "../Commands/CurrencyCommand"

export class CommandFactory implements ICommandFactory {
    private readonly model: IModel

    constructor(model: IModel) {
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
            default:
                return null
        }
    }
}