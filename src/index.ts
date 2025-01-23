import {InputOutputConsoleService} from "./Services/InputOutputConsoleService"
import {Controller} from "./Controller"
import {CommandFactory} from "./Factory/CommandFactory"
import {Model} from "./Model/Model"
import {CurrencyService} from "./Services/Currency/CurrencyService"
import {CurrencyExchangeRatesProvider} from "./Services/Currency/CurrencyExchangeRatesProvider"

const model = new Model()
const inputOutputService = new InputOutputConsoleService()
const currencyService = new CurrencyService(new CurrencyExchangeRatesProvider())
const commandFactory = new CommandFactory(model, currencyService)
const app = new Controller(model, inputOutputService, commandFactory, currencyService)

app.run()