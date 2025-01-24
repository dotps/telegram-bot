import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"

export class CurrencyCommand implements ICommand {

    private responseData: ResponseData = {
        data: [
            `Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена.`
        ]
    }
    private currencyService: ICurrencyService

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    async execute(): Promise<ResponseData | null> {
        const currencies = await this.currencyService.getCurrencyList()
        return this.responseData
    }

}