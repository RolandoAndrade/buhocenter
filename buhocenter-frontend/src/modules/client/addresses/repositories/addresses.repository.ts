import { HttpRepository } from '@/http/http.repository';
import { AxiosResponse } from 'axios';
import { Address } from '../interfaces/address.interface';

class AddressesRepository extends HttpRepository {
    private static readonly RESOURCE = 'address';

    createAddress(address): Promise<Address[]> {
        return this.post(
            this.createUri([`${AddressesRepository.RESOURCE}`, 'verification']),
            address,
            this.createHeader(),
        );
    }

    getCustomerAddresses(customerId: number): Promise<Address[]> {
        return this.get(
            this.createUri([`${AddressesRepository.RESOURCE}`], { customerId }),
            this.createHeader(),
        );
    }

    setAddressAsDefault(address: Address): Promise<string> {
        return this.patch(this.createUri([`${AddressesRepository.RESOURCE}`]), address, this.createHeader());
    }

    deleteAddress(addressId: number): Promise<string> {
        return this.delete(
            this.createUri([`${AddressesRepository.RESOURCE}`, `${addressId}`]),
            this.createHeader(),
        );
    }
}

export default new AddressesRepository();
