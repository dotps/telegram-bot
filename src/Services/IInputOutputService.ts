import {ResponseData} from "../Data/ResponseData"
import {IQueryData} from "../Data/ConsoleQueryData"

export interface IInputOutputService {
    start(): void
    stop(): void
    sendResponse(response: ResponseData | null, queryData?: IQueryData): Promise<void>
}