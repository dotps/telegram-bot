import {CurrencyRatio} from "./CurrencyProviderExchangeRatesApi"

export interface ICurrencyProvider {
    getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null>
}