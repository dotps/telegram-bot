import {ICurrencyProvider} from "./ICurrencyProvider"

export class CurrencyExchangeRatesProvider implements ICurrencyProvider {

    private baseUrl: string = "https://api.exchangeratesapi.io/v1/"
    private readonly apiKey:string = ""

    getRates(currencies: string[]): void {

    }

}