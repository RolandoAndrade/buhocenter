import { CurrencyInterface } from '@/plugins/currency/currency.interface';

export interface CurrencyRepositoryInterface {
    change: (amount: number, toCurrency: string, fromCurrency?: string) => number;
    init();
    setCurrency(currency: string);
    getCurrentExchangeFor(amount: number): number;
    getCurrentSymbol(): string;
    getAvailableCurrencies(): CurrencyInterface[];
}
