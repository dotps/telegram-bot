import { ResponseData } from "../Data/ResponseData";
import {ICommand} from "./ICommand"
import {IModel} from "../Model/IModel"

export class ExitCommand implements ICommand {

    private model: IModel
    private responseData: ResponseData = {
        data: [
            `Выход.`
        ]
    }

    constructor(model: IModel) {
        this.model = model
    }

    async execute(): Promise<ResponseData | null> {
        this.model.stopApp()
        return this.responseData
    }
}