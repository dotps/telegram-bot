import {InputOutputConsoleService} from "./Services/InputOutputConsoleService"
import {Controller} from "./Controller"
import {CommandFactory} from "./Factory/CommandFactory"
import {Model} from "./Model/Model"
import {CurrencyService} from "./Services/Currency/CurrencyService"
import {CurrencyProviderExchangeRatesApi} from "./Services/Currency/CurrencyProviderExchangeRatesApi"
import {ConsoleLogger} from "./Utils/ConsoleLogger"
import {Logger} from "./Utils/Logger"
import {WebRequestFetchService} from "./Services/WebRequestFetchService"

const model = new Model()
Logger.init(new ConsoleLogger(true))
const inputOutputService = new InputOutputConsoleService()
const webRequestService = new WebRequestFetchService()
const currencyService = new CurrencyService(new CurrencyProviderExchangeRatesApi(webRequestService))
const commandFactory = new CommandFactory(model, currencyService)
const app = new Controller(model, inputOutputService, commandFactory, currencyService)

app.run()