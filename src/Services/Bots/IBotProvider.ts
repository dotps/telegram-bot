export interface IBotProvider {
    sendResponse(method: string): Promise<void>
    init(): Promise<void>
    getBotId(): number
}

