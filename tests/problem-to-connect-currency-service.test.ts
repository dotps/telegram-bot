import {IQueryData} from "../src/data/query-data.interface"
import {IInputOutputService} from "../src/services/input-output.interface"
import {Model} from "../src/model/model"
import {WebRequestFetchService} from "../src/services/web-request-fetch.service"
import {createQueryData} from "./test-methods"
import {FreeCurrencyApiCurrencyProvider} from "../src/services/Currency/free-currency-api.provider"
import {ICurrencyProvider} from "../src/services/Currency/currency-provider.interface"
import {IModel} from "../src/model/model.interface"
import {CurrencyService} from "../src/services/Currency/currency.service"
import {CommandFactory} from "../src/factory/command-factory"
import {CommandHandler} from "../src/commands/command-handler"
import {IWebRequestService} from "../src/services/web-request.interface"

const badResponse = "Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."

describe("Тестирование связи с внешними сервисами", () => {
    let mockInputOutputService: jest.Mocked<IInputOutputService>
    let model: Model
    let webRequestFetchService = new WebRequestFetchService()
    const input = "USD-EUR"
    const queryData: IQueryData = createQueryData(input)

    beforeEach(() => {
        model = new Model()

        mockInputOutputService = {
            sendResponse: jest.fn(),
            start: jest.fn(),
            stop: jest.fn()
        }

        jest.clearAllMocks()
    })

    describe("Проблемы связи сервисом курса валют", () => {

        it("Обычный запрос к сервису", async () => {
            const currencyProvider = new FreeCurrencyApiCurrencyProvider(webRequestFetchService)
            const commandHandler = getCommandHandler(currencyProvider, model, mockInputOutputService)

            console.log(`\nТест: Обычный запрос к сервису\nОбработка команды "${input}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)
        }, 10000)

        it("Должен вернуть ошибку при обращении к несуществующему адресу", async () => {
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService)
            const commandHandler = getCommandHandler(currencyProvider, model, mockInputOutputService)

            console.log(`\nТест: Обработка команды "${input}"`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)

            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при не валидном ответе от сервера", async () => {
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/200")
            const commandHandler = getCommandHandler(currencyProvider, model, mockInputOutputService)

            console.log(`\nТест: Обработка команды "${input}" с невалидным ответом`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)

            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при 404 ответе от сервера", async () => {
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/404")
            const commandHandler = getCommandHandler(currencyProvider, model, mockInputOutputService)

            console.log(`\nТест: Обработка команды "${input}" с ошибкой 404`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)

            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при 500 ответе от сервера", async () => {
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/500")
            const commandHandler = getCommandHandler(currencyProvider, model, mockInputOutputService)

            console.log(`\nТест: Обработка команды "${input}" с ошибкой 500`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)

            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при таймауте", async () => {
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/200?sleep=15000")
            const commandHandler = getCommandHandler(currencyProvider, model, mockInputOutputService)

            console.log(`\nТест: Обработка команды "${input}" с таймаутом`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)

            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)
    })
})

const getCommandHandler = (currencyProvider: ICurrencyProvider, model: IModel, mockInputOutputService: IInputOutputService) => {
    const currencyService = new CurrencyService(currencyProvider)
    const commandFactory = new CommandFactory(model, currencyService)
    return new CommandHandler(
        mockInputOutputService,
        commandFactory,
        currencyService
    )
}

class BadCurrencyProvider extends FreeCurrencyApiCurrencyProvider {
    constructor(webRequestService: IWebRequestService, url: string = "https://non-exist-api.example.com/v1/latest") {
        super(webRequestService)
        // @ts-ignore
        this.apiUrl = url
        // @ts-ignore
        this.baseUrl = this.apiUrl
    }

    getApiUrl() {
        // @ts-ignore
        return this.apiUrl
    }
}

jest.mock("../src/utils/logger", () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn()
    }
}))