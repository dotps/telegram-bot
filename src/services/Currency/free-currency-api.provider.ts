import {IWebRequestService} from "../web-request.interface"
import {ICurrencyProvider} from "./currency-provider.interface"
import {CurrencyRatio} from "./currency-ratio"

export class FreeCurrencyApiCurrencyProvider implements ICurrencyProvider {

    private readonly apiUrl: string = "https://api.freecurrencyapi.com/v1/latest"
    private readonly apiKey: string = "fca_live_LSdt6F2lOd0j7sGv1AP9EC8qPKrIRMPgONWCY8uk"
    private readonly baseUrl: string = this.apiUrl + "?apikey=" + this.apiKey
    private readonly webRequestService: IWebRequestService

    constructor(webRequestService: IWebRequestService) {
        this.webRequestService = webRequestService
    }

    async getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null> {

        const response = await this.webRequestService.tryGet(this.baseUrl)
        if (this.isNotValidResponse(response)) return null

        const [firstCurrencyKey, secondCurrencyKey] = currencies
        const firstCurrencyValue = Number(response.data[firstCurrencyKey])
        const secondCurrencyValue = Number(response.data[secondCurrencyKey])

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

        return Object.keys(response.data)
    }

    private isNotValidResponse(response: any) {
        return !response?.data
    }
}

