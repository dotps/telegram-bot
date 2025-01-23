import {Commands} from "./Commands/Commands"
import {IInputOutputService} from "./Services/IInputOutputService"
import {StartCommand} from "./Commands/StartCommand"

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

            let responseData = {}

            switch (input) {
                case Commands.EXIT:
                    this.inputOutputService.close()
                    isRunning = false
                    break
                case Commands.START:
                    const command = new StartCommand()
                    responseData = command.execute()
                    break
                case Commands.CURRENCY:
                    responseData = {
                        data: [
                            `Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена.`
                        ]
                    }
                    break
                default:
                    responseData = {
                        data: "Неизвестная комманда."
                    }
            }

            if (responseData) {
                this.inputOutputService.sendResponse(responseData)
            }

        }
    }
}