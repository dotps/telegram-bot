import {ResponseData} from "../Data/ResponseData"

export interface ICommand {
    execute(): ResponseData
}