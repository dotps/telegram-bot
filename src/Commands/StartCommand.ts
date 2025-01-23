import {Commands} from "./Commands"
import {ICommand} from "./ICommand"
import {ResponseData} from "../Data/ResponseData"

export class StartCommand implements ICommand {

    private responseData: ResponseData = {
        data: [
            `Привет! Я помогу тебе узнать текущие курсы валют.`,
            `Напиши /${Commands.CURRENCY} для получения списка доступных валют.`
        ]
    }

    execute(): ResponseData {


        return this.responseData
    }

}