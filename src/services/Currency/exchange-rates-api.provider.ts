import {IWebRequestService} from "../web-request.interface"
import {ICurrencyProvider} from "./currency-provider.interface"
import {CurrencyRatio} from "./currency-ratio"

export class ExchangeRatesApiCurrencyProvider implements ICurrencyProvider {

    private readonly apiUrl: string = "https://api.exchangeratesapi.io/v1/latest"
    private readonly apiKey: string = "e4bc5f02eb4d7bd6ade74a71ade2089c"
    private readonly baseUrl: string = this.apiUrl + "?access_key=" + this.apiKey
    private readonly webRequestService: IWebRequestService

    constructor(webRequestService: IWebRequestService) {
        this.webRequestService = webRequestService
    }

    async getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null> {

        const response = await this.webRequestService.tryGet(this.baseUrl)
        if (this.isNotValidResponse(response)) return null

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

    async getCurrencySymbols(): Promise<string[] | null> {
        const response = await this.webRequestService.tryGet(this.baseUrl)
        if (this.isNotValidResponse(response)) return null

        return Object.keys(response.rates)
    }

    private isNotValidResponse(response: any) {
        return !(response?.base && response?.rates)
    }
}

