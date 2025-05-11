import {CommandHandler} from "../src/Commands/CommandHandler"
import {IInputOutputService} from "../src/Services/IInputOutputService"
import {IQueryData} from "../src/Data/IQueryData"
import {CommandFactory} from "../src/Factory/CommandFactory"
import {Model} from "../src/Model/Model"
import {CurrencyService} from "../src/Services/Currency/CurrencyService"
import {ICurrencyProvider} from "../src/Services/Currency/ICurrencyProvider"

jest.mock("../src/Utils/Logger", () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn()
    }
}))

describe("CommandHandler", () => {
    let mockInputOutputService: jest.Mocked<IInputOutputService>
    let mockCurrencyProvider: jest.Mocked<ICurrencyProvider>
    let currencyService: CurrencyService
    let commandHandler: CommandHandler
    let commandFactory: CommandFactory
    let model: Model

    beforeEach(() => {
        mockInputOutputService = {
            sendResponse: jest.fn(),
            start: jest.fn(),
            stop: jest.fn()
        }
        mockCurrencyProvider = {
            getCurrencyRatio: jest.fn().mockImplementation((currencies: string[]) => {
                const [first, second] = currencies
                const rates: { [key: string]: number } = {
                    "USD": 1.0,
                    "EUR": 0.85,
                    "GBP": 0.75
                }
                const ratio = rates[second] / rates[first]
                return Promise.resolve({
                    firstCurrency: first,
                    secondCurrency: second,
                    ratio: ratio
                })
            }),
            getCurrencySymbols: jest.fn().mockResolvedValue(["USD", "EUR", "GBP"])
        }
        currencyService = new CurrencyService(mockCurrencyProvider)
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
        const createQueryData = (text: string): IQueryData => ({text})
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