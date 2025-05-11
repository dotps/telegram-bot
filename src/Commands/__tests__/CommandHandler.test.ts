import { CommandHandler } from "../CommandHandler"
import { IInputOutputService } from "../../Services/IInputOutputService"
import { ICurrencyService } from "../../Services/Currency/ICurrencyService"
import { IQueryData } from "../../Data/IQueryData"
import { CommandFactory } from "../../Factory/CommandFactory"
import { Model } from "../../Model/Model"
import { CurrencyService } from "../../Services/Currency/CurrencyService"
import { ICurrencyProvider } from "../../Services/Currency/ICurrencyProvider"
import { CurrencyRatio } from "../../Services/Currency/CurrencyRatio"

// Mock Logger
jest.mock("../../Utils/Logger", () => ({
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
                // Для тестов используем фиксированные курсы
                const rates: { [key: string]: number } = {
                    'USD': 1.0,
                    'EUR': 0.85,
                    'GBP': 0.75
                }
                const ratio = rates[second] / rates[first]
                return Promise.resolve({
                    firstCurrency: first,
                    secondCurrency: second,
                    ratio: ratio
                })
            }),
            getCurrencySymbols: jest.fn().mockResolvedValue(['USD', 'EUR', 'GBP'])
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
        const createQueryData = (text: string): IQueryData => ({ text })
        const commands = [
            "/start",
            "/Start",
            "/ start",
            "/test",
            "/currency",
            "USD-EUR",
            "usd-eur",
            "EUR-USD",
        ]

        commands.forEach(input => {
            it(`проверка команды ${input}`, async () => {
                console.log(`\nТест: Обработка команды ${input}`)
                console.log(`Входные данные: "${input}"`)
                
                await commandHandler.handleQuery(createQueryData(input))
                
                const response = mockInputOutputService.sendResponse.mock.calls[0]
                console.log(`Отправлен ответ:`, response[0])
            })
        })
    })
}) 