import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { Address } from '@/modules/client/addresses/interfaces/address.interface';
import { ProductCarts } from '@/modules/client/cart/interfaces/carts.interface';

export interface PacketBasicInformationInterface {
    user: {
        name: string | undefined;
        lastName: string | undefined;
        email: string | undefined;
        address: Address;
    };
    productCarts: {
        description: string | undefined;
        productDimension: {
            weight: number | string | undefined;
            long: number | string | undefined;
            width: number | string | undefined;
            height: number | string | undefined;
        };
        fragile: boolean | undefined;
        hasInsurance: boolean | undefined;
        quantity: number | undefined;
    }[];
    currentlyAmount: number;
}
