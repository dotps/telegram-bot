import {CommandData} from "../data/command.data"
import {ICommand} from "../commands/command.interface"

export interface ICommandFactory {
    createCommand(commandData: CommandData): ICommand | null
}