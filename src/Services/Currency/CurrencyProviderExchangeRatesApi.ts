import {ICurrencyProvider} from "./ICurrencyProvider"
import {IWebRequestService} from "../IWebRequestService"

export class CurrencyProviderExchangeRatesApi implements ICurrencyProvider {

    private readonly baseUrl: string = "https://api.exchangeratesapi.io/v1/latest"
    private readonly apiKey:string = "e4bc5f02eb4d7bd6ade74a71ade2089c"
    private readonly webRequestService: IWebRequestService

    constructor(webRequestService: IWebRequestService) {
        this.webRequestService = webRequestService
    }

    async getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null> {

        const url = this.baseUrl + "?access_key=" + this.apiKey
        const response = await this.webRequestService.tryGet(url)

        if (this.isNotValidRatioResponse(response)) return null

        const [firstCurrencyKey, secondCurrencyKey] = currencies
        const firstCurrencyValue = Number(response.rates[firstCurrencyKey])
        const secondCurrencyValue = Number(response.rates[secondCurrencyKey])

        if (Number.isNaN(firstCurrencyValue) || Number.isNaN(secondCurrencyValue)) return null

        const ratio = secondCurrencyValue / firstCurrencyValue

        return {
            firstCurrency: firstCurrencyKey,
            secondCurrency: secondCurrencyKey,
            ratio: ratio,
        }
    }

    private isNotValidRatioResponse(response: any) {
        return !(response?.base && response?.rates)
    }
}

export type CurrencyRatio = {
    firstCurrency: string,
    secondCurrency: string,
    ratio: number,
}
