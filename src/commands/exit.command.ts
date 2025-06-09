import {ICommand} from "./command.interface"
import {IModel} from "../model/model.interface"
import {ResponseData} from "../data/response.data"

export class ExitCommand implements ICommand {

    private model: IModel
    private response: string[] = ["Выход."]

    constructor(model: IModel) {
        this.model = model
    }

    async execute(): Promise<ResponseData | null> {
        this.model.stopApp()
        return new ResponseData(this.response)
    }
}