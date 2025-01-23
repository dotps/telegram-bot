import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"

export class CurrencyCommand implements ICommand {

    private responseData: ResponseData = {
        data: [
            `Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена.`
        ]
    }

    execute(): ResponseData {
        return this.responseData
    }

}