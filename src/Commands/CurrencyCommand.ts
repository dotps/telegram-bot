import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"
import {ICurrencyService} from "../Services/Currency/ICurrencyService"

export class CurrencyCommand implements ICommand {

    private responseData: ResponseData = {
        data: [
            `Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена.`
        ]
    }
    private currencyService: ICurrencyService

    constructor(currencyService: ICurrencyService) {
        this.currencyService = currencyService
    }

    async execute(): Promise<ResponseData | null> {
        const symbols = await this.currencyService.getCurrencySymbols()
        if (!symbols) {
            this.responseData.data = ["Ой! Что-то пошло не так."]
            return this.responseData
        }

        this.responseData.data?.unshift(symbols.join(", "))
        this.responseData.data?.unshift("Доступные валюты:")
        return this.responseData
    }

}