import {Logger} from "../Utils/Logger"
import {IWebRequestService} from "./IWebRequestService"
import {log} from "node:util"

export class WebRequestFetchService implements IWebRequestService {

    async tryGet(url: string, timeout: number = 8000): Promise<any> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        const config = {
            headers: { "Accept": "application/json" },
            signal: controller.signal
        }

        try {
            Logger.log(`Query: ${url}`)

            const response = await fetch(url, config)
            const responseData = await response.json()

            clearTimeout(timeoutId)

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
                return null
            }
            Logger.error(`${error}`)
            return null
        }
    }

}