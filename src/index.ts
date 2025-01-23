import {InputOutputConsoleService} from "./Services/InputOutputConsoleService"
import {Controller} from "./Controller"
import {CommandFactory} from "./Factory/CommandFactory"
import {Model} from "./Model/Model"

const model = new Model()
const inputOutputService = new InputOutputConsoleService()
const commandFactory = new CommandFactory(model)
const app = new Controller(model, inputOutputService, commandFactory)

app.run()