import {QueryData} from "../../Data/QueryData"

export interface IBotProvider {
    sendResponse(text: string): Promise<void>
    getUpdates(): Promise<QueryData>
    init(): Promise<void>
    getBotId(): number
}

