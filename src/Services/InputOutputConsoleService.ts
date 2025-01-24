import {IInputOutputService} from "./IInputOutputService"
import {createInterface, Interface} from "node:readline/promises"
import {ResponseData} from "../Data/ResponseData"
import {QueryData} from "../Data/QueryData"

export class InputOutputConsoleService implements IInputOutputService {

    ioService: Interface
    beforeCursorText: string = "> "

    constructor() {
        this.ioService = createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    async getQuery(): Promise<QueryData> {
        const text = await this.ioService.question(this.beforeCursorText)
        return {
            text: text
        }
    }

    close(): void {
        this.ioService.close()
    }

    sendResponse(response: ResponseData): void {
        if (!response)
            return

        const data = response?.data || []
        for (const text of data) {
            console.log(text)
        }
    }
}