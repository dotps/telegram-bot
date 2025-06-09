import {ICurrencyService} from "../services/Currency/currency-service.interface"
import {ICommand} from "./command.interface"
import {ResponseData} from "../data/response.data"
import {Logger} from "../utils/logger"

const RESPONSE_ERROR: string = "Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."

export class CurrencyRatioCommand implements ICommand {

    private currencyService: ICurrencyService
    private readonly currencies: string[] | null

    constructor(currencyService: ICurrencyService, currencies: string[] | null) {
        this.currencies = currencies
        this.currencyService = currencyService
    }

    async execute(): Promise<ResponseData | null> {
        if (!this.currencies) return null

        const currencyRatio = await this.currencyService.getCurrencyRatio(this.currencies)
        if (!currencyRatio) {
            Logger.error(this.constructor.name + ", currencyRatio = null" + RESPONSE_ERROR)
            return new ResponseData([RESPONSE_ERROR])
        }

        const responseSuccess = `Текущий курс ${currencyRatio.firstCurrency} к ${currencyRatio.secondCurrency}: ${currencyRatio.ratio}.`
        return new ResponseData([responseSuccess])
    }
}