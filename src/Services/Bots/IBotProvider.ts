import {IQueryData} from "../../Data/IQueryData"

export interface IBotProvider {
    sendResponse(text: string, queryData: IQueryData): Promise<void>
    getUpdates(): Promise<IQueryData>
    init(): Promise<void>
    handleUpdate(requestData: any): Promise<IQueryData>
    isUseWebhook(): boolean
    getWebhookUrl(): string | undefined
}

