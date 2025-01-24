import {CurrencyRatio} from "./CurrencyProviderExchangeRatesApi"

export interface ICurrencyService {
    getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null>
}