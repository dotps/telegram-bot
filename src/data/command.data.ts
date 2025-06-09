import {ICommandDataParams} from "./command-data-params.interface"

export class CommandData {
    input: string
    params: ICommandDataParams

    constructor(input: string, params: ICommandDataParams) {
        this.input = input
        this.params = params
    }
}