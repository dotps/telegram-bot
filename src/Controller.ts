import {Commands} from "./Commands/Commands"
import {IInputOutputService} from "./Services/IInputOutputService"
import {StartCommand} from "./Commands/StartCommand"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {ResponseData} from "./Data/ResponseData"
import {IModel} from "./Model/IModel"

export class Controller {
    private readonly inputOutputService: IInputOutputService
    private commandFactory: ICommandFactory
    private model: IModel
    private defaultResponseData: ResponseData = {data: [`Неизвестная команда.`]}

    constructor(model: IModel, inputOutputService: IInputOutputService, commandFactory: ICommandFactory) {
        this.model = model
        this.commandFactory = commandFactory
        this.inputOutputService = inputOutputService
    }

    async run() {

        while (this.model.isAppRunning()) {

            let input  = await this.inputOutputService.getQuery()
            input = input.toLowerCase()

            let responseData = {}

            const command = this.commandFactory.createCommand(input)
            responseData = command ? command.execute() : this.defaultResponseData

            this.inputOutputService.sendResponse(responseData)
        }

        this.inputOutputService.close()
    }
}