import {ResponseData} from "../Data/ResponseData"

export interface IInputOutputService {
    start(): void
    close(): void
    sendResponse(response: ResponseData | null): Promise<void>
}