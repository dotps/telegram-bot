import {IQueryData, ConsoleQueryData} from "../../Data/ConsoleQueryData"

export interface IBotProvider {
    sendResponse(text: string, queryData: IQueryData): Promise<void>
    getUpdates(): Promise<IQueryData>
    init(): Promise<void>
    getBotId(): number
}

