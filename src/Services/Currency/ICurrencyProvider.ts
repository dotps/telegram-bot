export interface ICurrencyProvider {

    getRates(currencies: string[]): void
}