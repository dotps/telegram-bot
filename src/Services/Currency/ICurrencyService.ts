import {CurrencyRatio} from "./CurrencyRatio"

export interface ICurrencyService {
    getCurrencyRatio(currencies: string[]): Promise<CurrencyRatio | null>
}