import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"

export interface IInputOutputService {
    getQuery(): Promise<QueryData>
    close(): void
    sendResponse(response: ResponseData): void
}