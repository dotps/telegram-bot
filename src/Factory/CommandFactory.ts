import {ICommand} from "../Commands/ICommand"
import {Commands} from "../Commands/Commands"
import {StartCommand} from "../Commands/StartCommand"

export class CommandFactory {

    // TODO: продолжить делать фабрику

    createCommand(command: string): ICommand | null {
        switch (command) {
            // case Commands.EXIT:
            //     this.inputOutputService.close()
            //     isRunning = false
            //     break
            case Commands.START:
                const command = new StartCommand()
                // responseData = command.execute()
                break
            // case Commands.CURRENCY:
            //     break
            default:
                return null
        }
    }
}