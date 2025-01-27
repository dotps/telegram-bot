import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"

export interface IInputOutputService {
    getQuery(): Promise<QueryData>
    start(): void
    close(): void
    sendResponse(response: ResponseData | null): void
}