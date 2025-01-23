export interface IModel {
    stopApp(): void
    isAppRunning(): boolean
    setCurrencies(currencies: string[]): void
}