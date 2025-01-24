import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"

export class CurrencyRatioCommand implements ICommand {

    private currencyService: ICurrencyService
    private errorResponse = {
        data: ["Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."]
    }

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    async execute(currencies:string[] = []): Promise<ResponseData | null> {

        const rates = await this.currencyService.getCurrencyRatio(currencies)

        // TODO: тут продолжить, протестировать

        if (rates) {
            return {
                data: [
                    `Текущий курс ${rates.firstCurrency} к ${rates.secondCurrency}: ${rates.ratio}.`
                ]
            }
        }

        return this.errorResponse
    }

}