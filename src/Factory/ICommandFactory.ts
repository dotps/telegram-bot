import {ICommand} from "../Commands/ICommand"
import {CommandData} from "../CommandHandler"

export interface ICommandFactory {
    createCommand(commandData: CommandData): ICommand | null
}