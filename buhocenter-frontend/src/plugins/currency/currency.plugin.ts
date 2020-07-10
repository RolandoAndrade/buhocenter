import Vue_ from 'vue';
import { currencyRepository } from '@/plugins/currency/currency.repository';

export function CurrencyPlugin(Vue: typeof Vue_, options?: any): void {
    Vue.prototype.$currency = currencyRepository;
    Vue.mixin({
        data() {
            return {
                currency: currencyRepository,
            };
        },

        async beforeCreate() {
            await currencyRepository.init();
        },

        filters: {
            getCurrentExchangeFor(amount: number): number {
                return currencyRepository.getCurrentExchangeFor(amount);
            },
            getCurrentExchangeWithSymbolFor(amount: number): string | undefined {
                if (amount) {
                    return (
                        currencyRepository.getCurrentSymbol() +
                        currencyRepository.getCurrentExchangeFor(amount)
                    );
                }

                return undefined;
            },
        },
    });
}
