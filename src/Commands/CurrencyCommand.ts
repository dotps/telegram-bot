import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"
import {Logger} from "../Utils/Logger"

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