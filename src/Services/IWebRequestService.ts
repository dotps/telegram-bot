export interface IWebRequestService {
    tryGet(url: string, timeout?: number): Promise<any>
}