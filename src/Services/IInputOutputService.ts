import {ResponseData} from "../Data/ResponseData"
import {IQueryData} from "../Data/IQueryData"

export interface IInputOutputService {
    start(): void
    stop(): void
    sendResponse(response: ResponseData | null, queryData?: IQueryData): Promise<void>
}