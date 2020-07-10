import { CurrencyRepositoryInterface } from '@/plugins/currency/currency.repository.interface';
import { CurrencyRepository } from '@/plugins/currency/currency.repository';
import { CurrencyInterface } from '@/plugins/currency/currency.interface';

describe('Currency test', () => {
    let currencyTransformer: CurrencyRepositoryInterface;
    beforeEach(async () => {
        currencyTransformer = CurrencyRepository.getInstance();
        await currencyTransformer.init();
    });

    it('should retrieve the exchange for the currency', function () {
        const amount = 1; //USD
        const dollars: number = currencyTransformer.change(amount, 'USD');
        const euros: number = currencyTransformer.change(amount, 'EUR');
        const pounds: number = currencyTransformer.change(amount, 'GBP');
        expect(dollars).toBe(1);
        expect(euros).toBeLessThan(dollars);
        expect(pounds).toBeLessThan(euros);
    });

    it('should retrieve the available currencies', function () {
        const availableCurrencies: CurrencyInterface[] = currencyTransformer.getAvailableCurrencies();
        expect(availableCurrencies.length).toBe(6);
    });

    it('should change the current currency', function () {
        currencyTransformer.setCurrency('EUR');
        expect(currencyTransformer.getCurrentSymbol()).toBe('€');
        expect(currencyTransformer.getCurrentExchangeFor(1)).toBeLessThan(1);
    });
});
