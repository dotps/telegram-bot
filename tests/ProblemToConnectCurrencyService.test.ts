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

    describe("Проблемы связи сервисом курса валют", () => {
        it("должен вернуть ошибку при таймауте запроса к API", async () => {

            // TODO: продолжить имитацию таймаута (тест проходит, но просто через имитацию, попробовать сделать обращение к несуществующему адресу)

            // Настраиваем мок так, чтобы он возвращал null при таймауте
            mockWebRequestService.tryGet.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 100)); // Имитируем задержку
                return null; // Возвращаем null как при таймауте
            });

            // Имитируем команду /currency USD-EUR
            const queryData: IQueryData = {
                text: "USD-EUR"
            }

            // Запускаем обработку команды
            await commandHandler.handleQuery(queryData)

            // Проверяем, что пользователь получил сообщение об ошибке
            expect(mockInputOutputService.sendResponse).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: ["Ой! Что-то пошло не так. Убедись, что ввел валютную пару в формате USD-EUR, или попробуй позже."]
                }),
                queryData
            )
        }, 10000) // Увеличиваем таймаут теста до 10 секунд
    })

})