import {ResponseData} from "../Data/ResponseData"

export interface ICommand {
    execute(currencies?: string[] | null): Promise<ResponseData | null>
}