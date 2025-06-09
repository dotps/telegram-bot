import {ICurrencyProvider} from "./currency-provider.interface"
import {ICurrencyService} from "./currency-service.interface"

export class CurrencyService implements ICurrencyService {

    private currencyProvider: ICurrencyProvider

    constructor(currencyProvider: ICurrencyProvider) {
        this.currencyProvider = currencyProvider
    }

    async getCurrencyRatio(currencies: string[]) {
        return await this.currencyProvider.getCurrencyRatio(currencies)
    }

    async getCurrencySymbols(): Promise<string[] | null> {
        return await this.currencyProvider.getCurrencySymbols()
    }

    parseCurrencyCodes(input: string): string[] | null {
        const pattern = /^[A-Za-z]{3}-[A-Za-z]{3}$/
        return pattern.test(input) ? input.toUpperCase().split("-") : null
    }
}

