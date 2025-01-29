import {InputOutputConsoleService} from "./Services/InputOutputConsoleService"
import {CommandFactory} from "./Factory/CommandFactory"
import {Model} from "./Model/Model"
import {CurrencyService} from "./Services/Currency/CurrencyService"
import {ExchangeRatesApiCurrencyProvider} from "./Services/Currency/ExchangeRatesApiCurrencyProvider"
import {ConsoleLogger} from "./Utils/ConsoleLogger"
import {Logger} from "./Utils/Logger"
import {WebRequestFetchService} from "./Services/WebRequestFetchService"
import {IInputOutputService} from "./Services/IInputOutputService"
import {IWebRequestService} from "./Services/IWebRequestService"
import {ICurrencyProvider} from "./Services/Currency/ICurrencyProvider"
import {ICurrencyService} from "./Services/Currency/ICurrencyService"
import {ICommandFactory} from "./Factory/ICommandFactory"
import {IBotProvider} from "./Services/Bots/IBotProvider"
import {TelegramApiProvider} from "./Services/Bots/Telegram/TelegramApiProvider"
import {InputOutputHTTPService} from "./Services/InputOutputHTTPService"

Logger.init(new ConsoleLogger(true))

const model = new Model()
const webRequestService: IWebRequestService = new WebRequestFetchService()
const botProvider: IBotProvider = new TelegramApiProvider(model, webRequestService)
const currencyProvider: ICurrencyProvider = new ExchangeRatesApiCurrencyProvider(webRequestService)
const currencyService: ICurrencyService = new CurrencyService(currencyProvider)
const commandFactory: ICommandFactory = new CommandFactory(model, currencyService)

const isUseHttpServer = true
const inputOutputService: IInputOutputService = (isUseHttpServer)
    ? new InputOutputHTTPService(botProvider, currencyService, commandFactory)
    : new InputOutputConsoleService(model, currencyService, commandFactory)

inputOutputService.start()