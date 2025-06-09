import {ResponseData} from "../data/response.data"
import {IQueryData} from "../data/query-data.interface"

export interface IInputOutputService {
    start(): void
    stop(): void
    sendResponse(response: ResponseData | null, queryData?: IQueryData): Promise<void>
}