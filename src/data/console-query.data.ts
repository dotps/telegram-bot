import {IQueryData} from "./query-data.interface"

export class ConsoleQueryData implements IQueryData {
    text: string

    constructor(data?: any) {
        this.text = data?.text || ""
    }
}

