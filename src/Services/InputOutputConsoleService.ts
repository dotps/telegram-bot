import {IInputOutputService} from "./IInputOutputService"
import {createInterface, Interface} from "node:readline/promises"
import {ResponseData} from "../Data/ResponseData"

export class InputOutputConsoleService implements IInputOutputService {

    ioService: Interface

    constructor() {
        this.ioService = createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    async getQuery(text: string): Promise<string> {
        return await this.ioService.question(text)
    }

    close(): void {
        this.ioService.close()
    }

    sendResponse(response: ResponseData): void {
        if (!response)
            return
        console.log(response)
    }
}