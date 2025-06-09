import {IWebRequestService} from "./services/web-request.interface"
import {Logger} from "./utils/logger"
import {ConsoleLogger} from "./utils/console-logger"
import {Model} from "./model/model"
import {WebRequestFetchService} from "./services/web-request-fetch.service"
import {IBotProvider} from "./services/Bots/bot-provider.interface"
import {TelegramApiProvider} from "./services/Bots/Telegram/telegram-api.provider"
import {ICurrencyProvider} from "./services/Currency/currency-provider.interface"
import {FreeCurrencyApiCurrencyProvider} from "./services/Currency/free-currency-api.provider"
import {ICurrencyService} from "./services/Currency/currency-service.interface"
import {CurrencyService} from "./services/Currency/currency.service"
import {ICommandFactory} from "./factory/command-factory.interface"
import {CommandFactory} from "./factory/command-factory"
import {IInputOutputService} from "./services/input-output.interface"
import {InputOutputHTTPService} from "./services/input-output-http.service"
import {InputOutputConsoleService} from "./services/input-output-console.service"

async function bootstrap() {
    Logger.init(new ConsoleLogger(true))

    const model = new Model()
    const webRequestService: IWebRequestService = new WebRequestFetchService()
    const botProvider: IBotProvider = new TelegramApiProvider(model, webRequestService)
// const currencyProvider: ICurrencyProvider = new ExchangeRatesApiCurrencyProvider(webRequestService)
    const currencyProvider: ICurrencyProvider = new FreeCurrencyApiCurrencyProvider(webRequestService)
    const currencyService: ICurrencyService = new CurrencyService(currencyProvider)
    const commandFactory: ICommandFactory = new CommandFactory(model, currencyService)

    const isUseHttpServer = true
    const inputOutputService: IInputOutputService = (isUseHttpServer)
        ? new InputOutputHTTPService(botProvider, currencyService, commandFactory)
        : new InputOutputConsoleService(model, currencyService, commandFactory)

    inputOutputService.start()
}

bootstrap().catch(error => {})