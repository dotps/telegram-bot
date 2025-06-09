import {ICurrencyService} from "../services/Currency/currency-service.interface"
import {ICommand} from "./command.interface"
import {ResponseData} from "../data/response.data"
import {Logger} from "../utils/logger"

export class CurrencyCommand implements ICommand {

    private currencyService: ICurrencyService
    private responseError: string = "Ой! Что-то пошло не так."
    private responseSuccess: string = "Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена."
    private responseAvailable: string = "Доступные валюты:"
    private joinSymbolsPattern: string = ", "
    private response: string[] = []

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    async execute(): Promise<ResponseData | null> {

        const symbols = await this.currencyService.getCurrencySymbols()
        if (!symbols) {
            Logger.error(this.constructor.name + ", symbols = null" + this.responseError)
            return new ResponseData([this.responseError])
        }

        this.response.push(this.responseAvailable)
        this.response.push(symbols.join(this.joinSymbolsPattern))
        this.response.push(this.responseSuccess)

        return new ResponseData(this.response)
    }
}