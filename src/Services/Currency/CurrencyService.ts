import {ICurrencyService} from "./ICurrencyService"
import {ICurrencyProvider} from "./ICurrencyProvider"
import {IInputOutputService} from "../IInputOutputService"

export class CurrencyService implements ICurrencyService {

    private currencyProvider: ICurrencyProvider

    constructor(currencyProvider: ICurrencyProvider) {
        this.currencyProvider = currencyProvider
    }

    async getCurrencyRatio(currencies: string[]) {
        return await this.currencyProvider.getCurrencyRatio(currencies)
    }

    async getCurrencyList(): Promise<string[] | null> {
        // const currencyList = await this.currencyProvider.getCurrencyList()
        return null
    }

    parseCurrencyCodes(input: string): string[] | null {
        const pattern = /^[A-Za-z]{3}-[A-Za-z]{3}$/;
        return pattern.test(input) ? input.toUpperCase().split('-') : null
    }
}

