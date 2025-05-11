import {Logger} from "../Utils/Logger"
import {IWebRequestService} from "./IWebRequestService"

export class WebRequestFetchService implements IWebRequestService {

    async tryGet(url: string, timeout: number = 5000): Promise<any> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try {
            Logger.log(`Query: ${url}`)

            const response = await fetch(url, {signal: controller.signal})
            clearTimeout(timeoutId)

            const responseData = await response.json()

            if (!response.ok) {
                Logger.error(`${response.status} ${response.statusText} ${JSON.stringify(responseData)}`)
                return null
            }

            Logger.log(`Response: ${JSON.stringify(responseData)}`)

            return responseData
        } catch (error) {
            clearTimeout(timeoutId)
            if (error instanceof Error && error.name === "AbortError") {
                Logger.error(`Timeout after ${timeout}ms`)
                throw new Error("Timeout")
            }
            Logger.error(`${error}`)
            return null
        }
    }

}