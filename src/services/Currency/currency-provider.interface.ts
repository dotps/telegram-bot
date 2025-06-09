import {CurrencyRatio} from "./currency-ratio"

export interface ICurrencyProvider {
    getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null>
    getCurrencySymbols(): Promise<string[] | null>
}