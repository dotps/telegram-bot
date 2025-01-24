import {ICurrencyService} from "./ICurrencyService"
import {ICurrencyProvider} from "./ICurrencyProvider"
import {IInputOutputService} from "../IInputOutputService"

export class CurrencyService implements ICurrencyService {

    private currencyProvider: ICurrencyProvider
    private inputOutputService: IInputOutputService

    constructor(currencyProvider: ICurrencyProvider, inputOutputService: IInputOutputService) {
        this.inputOutputService = inputOutputService
        this.currencyProvider = currencyProvider
    }

    async getCurrencyRatio(currencies: string[]) {
        const rates = await this.currencyProvider.getCurrencyRatio(currencies)
        if (rates) {
            return rates
        }
        else {
            // const errorResponse = {
            //     data: ["Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."]
            // }
            // // TODO: так не правильно,
            // this.inputOutputService.sendResponse(errorResponse)
            return null
        }
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

