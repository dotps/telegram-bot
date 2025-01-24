import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"

export class CurrencyRatioCommand implements ICommand {

    private currencyService: ICurrencyService

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    async execute(currencies:string[] = []): Promise<ResponseData | null> {

        const rates = await this.currencyService.getCurrencyRatio(currencies)
        if (rates) {
            return {
                data: [
                    `Текущий курс ${rates.firstCurrency} к ${rates.secondCurrency}: ${rates.ratio}.`
                ]
            }
        }
        console.log(rates)

        return null
    }

}