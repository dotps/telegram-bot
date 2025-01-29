import {ResponseData} from "../Data/ResponseData"

export interface IInputOutputService {
    start(): void
    stop(): void
    sendResponse(response: ResponseData | null): Promise<void>
}