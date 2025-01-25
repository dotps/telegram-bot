import {CurrencyRatio} from "./CurrencyRatio"

export interface ICurrencyService {
    getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null>
    getCurrencySymbols(): Promise<string[] | null>
    parseCurrencyCodes(input: string): string[] | null
}