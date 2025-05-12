import {CommandHandler} from "../src/Commands/CommandHandler"
import {IInputOutputService} from "../src/Services/IInputOutputService"
import {IQueryData} from "../src/Data/IQueryData"
import {CommandFactory} from "../src/Factory/CommandFactory"
import {Model} from "../src/Model/Model"
import {CurrencyService} from "../src/Services/Currency/CurrencyService"
import {ICurrencyProvider} from "../src/Services/Currency/ICurrencyProvider"
import {FreeCurrencyApiCurrencyProvider} from "../src/Services/Currency/FreeCurrencyApiCurrencyProvider"
import {ICurrencyService} from "../src/Services/Currency/ICurrencyService"
import {ICommandFactory} from "../src/Factory/ICommandFactory"
import {IWebRequestService} from "../src/Services/IWebRequestService"
import {ResponseData} from "../src/Data/ResponseData"
import {WebRequestFetchService} from "../src/Services/WebRequestFetchService"
import {createQueryData} from "./testMethods"
import {CurrencyRatioCommand} from "../src/Commands/CurrencyRatioCommand"

const badResponse = "Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."

describe("Тестирование связи с внешними сервисами", () => {
    let mockInputOutputService: jest.Mocked<IInputOutputService>
    let mockWebRequestService: jest.Mocked<IWebRequestService>
    let currencyProvider: ICurrencyProvider
    let currencyService: ICurrencyService
    let commandHandler: CommandHandler
    let commandFactory: ICommandFactory
    let model: Model

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
            const webRequestFetchService = new WebRequestFetchService()
            const currencyProvider = new FreeCurrencyApiCurrencyProvider(webRequestFetchService)
            const currencyService = new CurrencyService(currencyProvider)
            const commandFactory = new CommandFactory(model, currencyService)
            const commandHandler = new CommandHandler(
                mockInputOutputService,
                commandFactory,
                currencyService
            )

            const input = "USD-EUR"
            const queryData: IQueryData = createQueryData(input)

            console.log(`\nТест: Обычный запрос к сервису\nОбработка команды "${input}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)
        }, 10000)

        it("Должен вернуть ошибку при обращении к несуществующему адресу", async () => {
            const webRequestFetchService = new WebRequestFetchService()
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService)
            const currencyService = new CurrencyService(currencyProvider)
            const commandFactory = new CommandFactory(model, currencyService)
            const commandHandler = new CommandHandler(
                mockInputOutputService,
                commandFactory,
                currencyService
            )

            const input = "USD-EUR"
            const queryData: IQueryData = createQueryData(input)

            console.log(`\nТест: Обработка команды "${input}"`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)
            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при не валидном ответе от сервера", async () => {
            const webRequestFetchService = new WebRequestFetchService()
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/200")
            const currencyService = new CurrencyService(currencyProvider)
            const commandFactory = new CommandFactory(model, currencyService)
            const commandHandler = new CommandHandler(
                mockInputOutputService,
                commandFactory,
                currencyService
            )

            const input = "USD-EUR"
            const queryData: IQueryData = createQueryData(input)
            console.log(`\nТест: Обработка команды "${input}" с невалидным ответом`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)
            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при 404 ответе от сервера", async () => {
            const webRequestFetchService = new WebRequestFetchService()
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/404")
            const currencyService = new CurrencyService(currencyProvider)
            const commandFactory = new CommandFactory(model, currencyService)
            const commandHandler = new CommandHandler(
                mockInputOutputService,
                commandFactory,
                currencyService
            )

            const input = "USD-EUR"
            const queryData: IQueryData = createQueryData(input)
            console.log(`\nТест: Обработка команды "${input}" с ошибкой 404`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)
            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при 500 ответе от сервера", async () => {
            const webRequestFetchService = new WebRequestFetchService()
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/500")
            const currencyService = new CurrencyService(currencyProvider)
            const commandFactory = new CommandFactory(model, currencyService)
            const commandHandler = new CommandHandler(
                mockInputOutputService,
                commandFactory,
                currencyService
            )

            const input = "USD-EUR"
            const queryData: IQueryData = createQueryData(input)
            console.log(`\nТест: Обработка команды "${input}" с ошибкой 500`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)
            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)

        it("Должен вернуть ошибку при таймауте", async () => {
            const webRequestFetchService = new WebRequestFetchService()
            const currencyProvider = new BadCurrencyProvider(webRequestFetchService, "https://httpstat.us/200?sleep=15000")
            const currencyService = new CurrencyService(currencyProvider)
            const commandFactory = new CommandFactory(model, currencyService)
            const commandHandler = new CommandHandler(
                mockInputOutputService,
                commandFactory,
                currencyService
            )

            const input = "USD-EUR"
            const queryData: IQueryData = createQueryData(input)
            console.log(`\nТест: Обработка команды "${input}" с таймаутом`)
            console.log(`\nURL: "${currencyProvider.getApiUrl()}"`)

            await commandHandler.handleQuery(queryData)

            const response = mockInputOutputService.sendResponse.mock.calls[0]
            console.log(response)
            expect(response[0]?.data[0]).toBe(badResponse)
        }, 10000)
    })
})

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

jest.mock("../src/Utils/Logger", () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn()
    }
}))