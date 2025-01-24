import {ICurrencyService} from "./ICurrencyService"
import {ICurrencyProvider} from "./ICurrencyProvider"

export class CurrencyService implements ICurrencyService {
    private provider: ICurrencyProvider

    constructor(provider: ICurrencyProvider) {
        this.provider = provider
    }

    getRates(currencies: string[]) {
        // TODO: реализовать поставщика валют
        this.provider.getRates(currencies)
    }

    parseCurrencyCodes(input: string): string[] | null {
        const pattern = /^[A-Za-z]{3}-[A-Za-z]{3}$/;
        if (!pattern.test(input)) return null
        return input.toUpperCase().split('-')
    }
}

