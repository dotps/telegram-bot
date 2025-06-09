import {ResponseData} from "../data/response.data"

export interface ICommand {
    execute(currencies?: string[] | null): Promise<ResponseData | null>
}