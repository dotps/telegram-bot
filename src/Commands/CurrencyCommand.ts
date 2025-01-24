import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"

export class CurrencyCommand implements ICommand {

    private responseData: ResponseData = {
        data: [
            `Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена.`
        ]
    }

    constructor() {
    }

    async execute(currencies?: string[] | null): Promise<ResponseData | null> {
        console.log(currencies)
        return this.responseData
    }

}