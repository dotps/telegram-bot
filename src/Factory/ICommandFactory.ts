import {ICommand} from "../Commands/ICommand"

export interface ICommandFactory {
    createCommand(command: string): ICommand | null
}