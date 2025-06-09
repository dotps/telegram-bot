import {ICurrencyProvider} from "../src/services/Currency/currency-provider.interface"
import {IInputOutputService} from "../src/services/input-output.interface"
import {IWebRequestService} from "../src/services/web-request.interface"
import {ICurrencyService} from "../src/services/Currency/currency-service.interface"
import {CommandHandler} from "../src/commands/command-handler"
import {ICommandFactory} from "../src/factory/command-factory.interface"
import {Model} from "../src/model/model"
import {FreeCurrencyApiCurrencyProvider} from "../src/services/Currency/free-currency-api.provider"
import {CurrencyService} from "../src/services/Currency/currency.service"
import {CommandFactory} from "../src/factory/command-factory"
import {createQueryData} from "./test-methods"

jest.mock("../src/utils/logger", () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn()
    }
}))

describe("CommandHandler", () => {
    let mockInputOutputService: jest.Mocked<IInputOutputService>
    let mockWebRequestService: jest.Mocked<IWebRequestService>
    let currencyProvider: ICurrencyProvider
    let currencyService: ICurrencyService
    let commandHandler: CommandHandler
    let commandFactory: ICommandFactory
    let model: Model

    beforeEach(() => {
        mockInputOutputService = {
            sendResponse: jest.fn(),
            start: jest.fn(),
            stop: jest.fn()
        }

        mockWebRequestService = {
            tryGet: jest.fn().mockResolvedValue({
                data: {
                    USD: 1.0,
                    EUR: 0.85,
                    GBP: 0.75
                }
            })
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

    describe("handleQuery", () => {
        const commands = [
            "/start",
            "/Start",
            "/ start",
            "/test",
            "/currency",
            "USD-EUR",
            "usd-eur",
            "EUR-USD",
            "EUR-YYY",
            "ZZZ-XXX",
            "руб-дол",
            "pln-руб",
            "pln-xxx",
        ]

        commands.forEach(input => {
            it(`Проверка команды ${input}`, async () => {
                console.log(`\nТест: Обработка команды ${input}`)
                await commandHandler.handleQuery(createQueryData(input))
                const response = mockInputOutputService.sendResponse.mock.calls[0]
                console.log(`Отправлен ответ:`, response[0])
            })
        })
    })
}) 