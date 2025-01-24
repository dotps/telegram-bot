import {Logger} from "../Utils/Logger"
import {IWebRequestService} from "./IWebRequestService"

export class WebRequestFetchService implements IWebRequestService {

    async tryGet(url: string): Promise<any> {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                Logger.error(`Ошибка: ${response.status} ${response.statusText}`)
                return null
            }
            return await response.json()
        }
        catch (e) {
            Logger.error(`Ошибка: ${e}`)
            return null
        }
    }
}