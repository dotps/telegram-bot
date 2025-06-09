import {IQueryData} from "../../data/query-data.interface"

export interface IBotProvider {
    sendResponse(text: string, queryData: IQueryData): Promise<void>
    getUpdates(): Promise<IQueryData>
    init(): Promise<void>
    handleUpdate(requestData: any): Promise<IQueryData>
    isUseWebhook(): boolean
    getWebhookUrl(): string | undefined
}

