import {CurrencyRatio} from "./CurrencyRatio"

export interface ICurrencyProvider {
    getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null>
    getCurrencySymbols(): Promise<string[] | null>
}