import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"

export class CurrencyRatioCommand implements ICommand {

    private currencyService: ICurrencyService
    private responseError: string = "Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    async execute(currencies:string[] = []): Promise<ResponseData | null> {
        const currencyRatio = await this.currencyService.getCurrencyRatio(currencies)
        if (!currencyRatio) return new ResponseData([this.responseError])

        const responseSuccess = `Текущий курс ${currencyRatio.firstCurrency} к ${currencyRatio.secondCurrency}: ${currencyRatio.ratio}.`
        return new ResponseData([responseSuccess])
    }

}