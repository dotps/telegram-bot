import {ICurrencyService} from "../services/Currency/currency-service.interface"
import {ICommand} from "./command.interface"
import {ResponseData} from "../data/response.data"
import {Logger} from "../utils/logger"

const RESPONSE_ERROR: string = "Ой! Что-то пошло не так."
const RESPONSE_SUCCESS: string = "Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена."
const RESPONSE_AVAILABLE: string = "Доступные валюты:"

export class CurrencyCommand implements ICommand {
    private currencyService: ICurrencyService
    private joinSymbolsPattern: string = ", "
    private response: string[] = []

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    async execute(): Promise<ResponseData | null> {

        const symbols = await this.currencyService.getCurrencySymbols()
        if (!symbols) {
            Logger.error(this.constructor.name + ", symbols = null" + RESPONSE_ERROR)
            return new ResponseData([RESPONSE_ERROR])
        }

        this.response.push(RESPONSE_AVAILABLE)
        this.response.push(symbols.join(this.joinSymbolsPattern))
        this.response.push(RESPONSE_SUCCESS)

        return new ResponseData(this.response)
    }
}