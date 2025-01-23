import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"

export class CurrencyPairCommand implements ICommand {

    private responseData: ResponseData = {
        data: [
            `Текущий курс USD к EUR: 0.00.`
        ]
    }
    private currencyService: ICurrencyService

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    execute(): ResponseData {
        return this.responseData
    }

}