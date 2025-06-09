import {ICommand} from "./command.interface"
import {Commands} from "./commands"
import {ResponseData} from "../data/response.data"

export class StartCommand implements ICommand {

    private response: string[] = [
        `Привет! Я помогу тебе узнать текущие курсы валют.`,
        `Напиши ${Commands.Currency} для получения списка доступных валют.`
    ]

    async execute(): Promise<ResponseData | null> {
        return new ResponseData(this.response)
    }

}