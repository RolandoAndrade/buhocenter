import { Address } from '@/modules/client/addresses/interfaces/address.interface';

export interface AddressesStateInterface {
    display: boolean;
    addresses: Address[];
}
