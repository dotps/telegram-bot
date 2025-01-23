import {IModel} from "./IModel"

export class Model implements  IModel {

    private isRunning: boolean = true

    isAppRunning(): boolean {
        return this.isRunning
    }

    stopApp(): void {
        this.isRunning = false
    }

    setCurrencies(currencies: string[]): void {
        // TODO: продолжить здесь
    }
}