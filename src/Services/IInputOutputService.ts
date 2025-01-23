import {ResponseData} from "../Data/ResponseData"

export interface IInputOutputService {
    getQuery(): Promise<string>
    close(): void
    sendResponse(response: ResponseData): void
}