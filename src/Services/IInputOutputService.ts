import {ResponseData} from "../Data/ResponseData"

export interface IInputOutputService {
    getQuery(text: string): Promise<string>
    close(): void
    sendResponse(response: ResponseData): void
}