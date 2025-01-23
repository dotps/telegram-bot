import {Commands} from "./Commands/Commands"
import {IInputOutputService} from "./Services/IInputOutputService"

export class Controller {
    private readonly inputOutputService: IInputOutputService

    constructor(inputOutputService: IInputOutputService) {
        this.inputOutputService = inputOutputService
    }

    async run() {

        let isRunning = true

        while (isRunning) {
            let input  = await this.inputOutputService.getQuery("> ")
            input = input.toLowerCase()

            switch (input) {
                case Commands.EXIT:
                    this.inputOutputService.close()
                    isRunning = false
                    break
                default:
                    const responseData = {
                        data: "Неизвестная комманда."
                    }
                    this.inputOutputService.sendResponse(responseData)
            }
        }
    }
}