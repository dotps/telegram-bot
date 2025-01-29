import {IQueryData} from "./IQueryData"

export class ConsoleQueryData implements IQueryData {
    text: string

    constructor(data?: any) {
        this.text = data?.text || ""
    }
}

