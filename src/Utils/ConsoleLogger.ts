import {ILoggerService} from "./ILoggerService";

export class ConsoleLogger implements ILoggerService {

    private readonly enabled: boolean

    constructor(enabled: boolean = true) {
        this.enabled = enabled
    }

    isEnabled(): boolean {
        return this.enabled
    }

    error(text: any): void {
        console.error(text)
    }

    log(text: string): void {
        if (!this.enabled) return
        console.log(text)
    }
}