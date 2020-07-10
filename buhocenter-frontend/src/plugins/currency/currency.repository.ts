import { HttpRepository } from '@/http/http.repository';
import { CurrencyRepositoryInterface } from '@/plugins/currency/currency.repository.interface';
import { CurrencyInterface } from '@/plugins/currency/currency.interface';

const AVAILABLE_CURRENCIES: { [currencyIso: string]: CurrencyInterface } = {
    USD: {
        name: 'DOLAR',
        symbol: '$',
        iso: 'USD',
    },
    EUR: {
        name: 'EURO',
        symbol: '€',
        iso: 'EUR',
    },
    GBP: {
        name: 'POUND',
        symbol: '£',
        iso: 'GBP',
    },
    BRL: {
        name: 'REAL',
        symbol: 'R$',
        iso: 'BRL',
    },
    RUB: {
        name: 'ROUBLE',
        symbol: 'руб.',
        iso: 'RUB',
    },
    CNY: {
        name: 'YUAN',
        symbol: '¥',
        iso: 'CNY',
    },
};

const CURRENCY_API = 'https://api.exchangeratesapi.io/latest?base=USD';

export class CurrencyRepository extends HttpRepository implements CurrencyRepositoryInterface {
    private static _instance: CurrencyRepository;
    private _isLoaded = false;
    private _currentCurrency: CurrencyInterface = AVAILABLE_CURRENCIES.USD;
    private _exchange: { [key: string]: number } = {};

    private async _getExchange() {
        const data: { rates: { [key: string]: number } } = await this.get(CURRENCY_API);
        this._exchange = data.rates;
    }

    public change(amount: number, toCurrency: string, fromCurrency = 'USD'): number {
        if (this._exchange[toCurrency]) {
            amount = (amount * this._exchange[toCurrency]) / this._exchange[fromCurrency];
        }
        amount = Math.round(amount * 100) / 100;
        return amount;
    }

    getCurrentSymbol(): string {
        return this._currentCurrency ? this._currentCurrency.symbol : AVAILABLE_CURRENCIES.USD.symbol;
    }

    getCurrentExchangeFor(amount: number): number {
        return this.change(amount, this._currentCurrency.iso);
    }

    setCurrency(currency: string) {
        this._currentCurrency = AVAILABLE_CURRENCIES[currency]
            ? AVAILABLE_CURRENCIES[currency]
            : this._currentCurrency;
    }

    getAvailableCurrencies(): CurrencyInterface[] {
        const r: CurrencyInterface[] = [];
        for (const i in AVAILABLE_CURRENCIES) {
            r.push(AVAILABLE_CURRENCIES[i]);
        }
        return r;
    }

    async init() {
        if (!this._isLoaded) {
            this._isLoaded = true;
            await this._getExchange();
        }
    }

    private constructor() {
        super();
    }

    static getInstance(): CurrencyRepositoryInterface {
        if (!CurrencyRepository._instance) {
            CurrencyRepository._instance = new CurrencyRepository();
        }
        return CurrencyRepository._instance;
    }
}

export const currencyRepository = CurrencyRepository.getInstance();
