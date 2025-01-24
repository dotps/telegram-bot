import {InputOutputConsoleService} from "./Services/InputOutputConsoleService"
import {Controller} from "./Controller"
import {CommandFactory} from "./Factory/CommandFactory"
import {Model} from "./Model/Model"
import {CurrencyService} from "./Services/Currency/CurrencyService"
import {CurrencyProviderExchangeRatesApi} from "./Services/Currency/CurrencyProviderExchangeRatesApi"
import {ConsoleLogger} from "./Utils/ConsoleLogger"
import {Logger} from "./Utils/Logger"
import {WebRequestFetchService} from "./Services/WebRequestFetchService"
import {IInputOutputService} from "./Services/IInputOutputService"
import {IWebRequestService} from "./Services/IWebRequestService"
import {ICurrencyProvider} from "./Services/Currency/ICurrencyProvider"
import {ICurrencyService} from "./Services/Currency/ICurrencyService"
import {ICommandFactory} from "./Factory/ICommandFactory"

const model = new Model()
Logger.init(new ConsoleLogger(true))
const inputOutputService: IInputOutputService = new InputOutputConsoleService()
const webRequestService: IWebRequestService = new WebRequestFetchService()
const currencyProvider: ICurrencyProvider = new CurrencyProviderExchangeRatesApi(webRequestService)
const currencyService: ICurrencyService = new CurrencyService(currencyProvider, inputOutputService)
const commandFactory: ICommandFactory = new CommandFactory(model, currencyService)
const app = new Controller(model, inputOutputService, commandFactory, currencyService)

app.run()