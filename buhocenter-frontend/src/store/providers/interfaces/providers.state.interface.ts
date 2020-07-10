import { Provider } from '@/modules/client/provider/interfaces/provider.interface';

export interface ProviderStateInterface {
    Providers: Provider[];
    err_Providers: boolean;
}
