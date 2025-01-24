import {ICurrencyService} from "./ICurrencyService"
import {ICurrencyProvider} from "./ICurrencyProvider"

export class CurrencyService implements ICurrencyService {
    private currencyProvider: ICurrencyProvider
    private errorMessage = "Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."

    constructor(currencyProvider: ICurrencyProvider) {
        this.currencyProvider = currencyProvider
    }

    async getCurrencyRatio(currencies: string[]) {
        const rates = await this.currencyProvider.getCurrencyRatio(currencies)
        if (rates) {
            console.log(rates)
            return rates
        }
        else {
            console.log(this.errorMessage)
            return null
        }
    }

    parseCurrencyCodes(input: string): string[] | null {
        const pattern = /^[A-Za-z]{3}-[A-Za-z]{3}$/;
        return pattern.test(input) ? input.toUpperCase().split('-') : null
    }
}

