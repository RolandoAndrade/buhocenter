import { CurrencyRepositoryInterface } from './currency.repository.interface';
declare module 'vue/types/vue' {
    interface Vue {
        $currency: CurrencyRepositoryInterface;
    }
}
