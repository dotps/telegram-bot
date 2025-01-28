export interface IBotProvider {
    sendResponse(method: string): Promise<void>
    getUpdates(): Promise<void>
    init(): Promise<void>
    getBotId(): number
}

