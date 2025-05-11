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

jest.mock("../src/Utils/Logger", () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn()
    }
}))

describe("Тестирование связи с внешними сервисами", () => {
    let mockInputOutputService: jest.Mocked<IInputOutputService>
    let mockWebRequestService: jest.Mocked<IWebRequestService>
    let currencyProvider: ICurrencyProvider
    let currencyService: ICurrencyService
    let commandHandler: CommandHandler
    let commandFactory: ICommandFactory
    let model: Model

    beforeEach(() => {
        jest.useFakeTimers()

        mockInputOutputService = {
            sendResponse: jest.fn(),
            start: jest.fn(),
            stop: jest.fn()
        }

        mockWebRequestService = {
            tryGet: jest.fn()
        }

        currencyProvider = new FreeCurrencyApiCurrencyProvider(mockWebRequestService)
        currencyService = new CurrencyService(currencyProvider)
        model = new Model()
        commandFactory = new CommandFactory(model, currencyService)
        commandHandler = new CommandHandler(
            mockInputOutputService,
            commandFactory,
            currencyService
        )

        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    describe("Проблемы связи сервисом курса валют", () => {
        const createQueryData = (text: string): IQueryData => ({text})
        const expectedError = "Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."

        // TODO: продолжить имитацию таймаута (+ протестировать новый fetch)

        it("Имитируем таймаут", async () => {
            mockWebRequestService.tryGet.mockRejectedValue(new Error("Timeout"))

            await commandHandler.handleQuery(createQueryData("USD-EUR"))

            const response = mockInputOutputService.sendResponse.mock.calls[0][0] as ResponseData
            expect(response.data[0]).toBe(expectedError)
        })

        /*
        it("Имитируем ошибку 500", async () => {
            mockWebRequestService.tryGet.mockRejectedValue(new Error("Internal Server Error"))

            await commandHandler.handleQuery(createQueryData("USD-EUR"))

            const response = mockInputOutputService.sendResponse.mock.calls[0][0] as ResponseData
            expect(response.data[0]).toBe(expectedError)
        })

        it("Имитируем сетевую ошибку", async () => {
            mockWebRequestService.tryGet.mockRejectedValue(new Error("Network Error"))

            await commandHandler.handleQuery(createQueryData("USD-EUR"))

            const response = mockInputOutputService.sendResponse.mock.calls[0][0] as ResponseData
            expect(response.data[0]).toBe(expectedError)
        })

        it("Имитируем неверный формат ответа", async () => {
            mockWebRequestService.tryGet.mockResolvedValue({
                data: "invalid data format"
            })

            await commandHandler.handleQuery(createQueryData("USD-EUR"))

            const response = mockInputOutputService.sendResponse.mock.calls[0][0] as ResponseData
            expect(response.data[0]).toBe(expectedError)
        })

        it("Имитируем превышение лимита запросов", async () => {
            mockWebRequestService.tryGet.mockRejectedValue(new Error("Rate limit exceeded"))

            await commandHandler.handleQuery(createQueryData("USD-EUR"))

            const response = mockInputOutputService.sendResponse.mock.calls[0][0] as ResponseData
            expect(response.data[0]).toBe(expectedError)
        })*/
    })
})