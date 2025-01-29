import {ICommand} from "../Commands/ICommand"

import {CommandData} from "../Data/CommandData"

export interface ICommandFactory {
    createCommand(commandData: CommandData): ICommand | null
}