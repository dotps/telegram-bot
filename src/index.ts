import {InputOutputConsoleService} from "./Services/InputOutputConsoleService"
import {Controller} from "./Controller"

const inputOutputService = new InputOutputConsoleService()
const app = new Controller(inputOutputService)

app.run()