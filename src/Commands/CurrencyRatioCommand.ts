import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"
import {Logger} from "../Utils/Logger"

export class CurrencyRatioCommand implements ICommand {

    private currencyService: ICurrencyService
    private responseError: string = "Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."
    private readonly currencies: string[] | null

    constructor(currencyService: ICurrencyService, currencies: string[] | null) {
        this.currencies = currencies
        this.currencyService = currencyService
    }

    async execute(): Promise<ResponseData | null> {
        if (!this.currencies) return null

        const currencyRatio = await this.currencyService.getCurrencyRatio(this.currencies)
        if (!currencyRatio) {
            Logger.error(this.constructor.name + ", currencyRatio = null" + this.responseError)
            return new ResponseData([this.responseError])
        }

        const responseSuccess = `Текущий курс ${currencyRatio.firstCurrency} к ${currencyRatio.secondCurrency}: ${currencyRatio.ratio}.`
        return new ResponseData([responseSuccess])
    }
}