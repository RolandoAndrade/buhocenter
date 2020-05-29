import { HttpRepository } from "@/http/http.repository";
import { AxiosResponse } from 'axios';

class AddressesRepository extends HttpRepository {
    private static readonly RESOURCE = 'address';

    createAddress(address): Promise<AxiosResponse<any>> {
        return this.post(this.createUri([`${AddressesRepository.RESOURCE}`, 'verification']), address, this.createHeader());
    }

    getCustomerAddresses(customerId: number): Promise<AxiosResponse<any>> {
        return this.get(this.createUri([`${AddressesRepository.RESOURCE}`], { customerId }), this.createHeader());
    }

    setAddressAsDefault(address: { id: number; customer: { id: number; }}): Promise<AxiosResponse<any>> {
        return this.patch(this.createUri([`${AddressesRepository.RESOURCE}`]), address, this.createHeader());
    }

    deleteAddress(addressId: number): Promise<AxiosResponse<any>> {
        return this.delete(this.createUri([`${AddressesRepository.RESOURCE}`, `${addressId}`]), this.createHeader())
    }    
}

export default new AddressesRepository();