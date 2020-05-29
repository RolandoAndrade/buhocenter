import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { Repository} from 'typeorm'
import { AddressVerificationDto, AddressVerificationRO, AddressVerificationSO } from '../dto/AddressVerification.dto'
import { Address } from '../entities/address.entity'
import { AddressHttpRepository } from '../repositories/address-http.repository'
import { UsersService } from '../../users/services/users.service'
import { STATUS } from '../../../config/constants';
import { StatusService } from '../../status/services/status.service'  
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

@Injectable() 
export class AddressService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(UsersService)
        private readonly usersService: UsersService,
        @Inject(StatusService)
        private readonly statusService: StatusService,
        @Inject(AddressHttpRepository) private readonly addressHttpRepository: AddressHttpRepository,
    ){}

    private async checkDefault(customerId: number, addressEntityManager: Repository<Address>){
        this.logger.debug(`checkDefault: checking address [customerId=${customerId}]`, { context: AddressService.name });
        const active = STATUS.ACTIVE.id;
        const verifyDefault = await addressEntityManager.findOne({
            where: [{ customer: customerId, status: active }]
        });

        if (verifyDefault) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Saves the given address in database
     * @param address address to save in database
     * @param addressEntityManager transactional address repository
     */
    private async saveAddress(address: AddressVerificationDto, addressEntityManager: Repository<Address>): Promise<void> {
        this.logger.debug(`saveAddress: saving address [address=${JSON.stringify(address)}]`, { context: AddressService.name });

        try {
            let currentCustomer = await this.usersService.findUser(address.customer.id);
            let allowDefault = await this.checkDefault(currentCustomer.id,addressEntityManager);
            let newAddress:Address =  new Address();

            newAddress.firstStreet = address.firstStreet;
            newAddress.secondStreet = address.secondStreet;
            newAddress.city = address.cityName;
            newAddress.state = address.state;
            newAddress.zipcode = address.zipcode;
            newAddress.customer = currentCustomer;
            newAddress.status = await this.statusService.getStatus(STATUS.ACTIVE.id);
            newAddress.setDefault = (allowDefault && address.default);

            await addressEntityManager.save(newAddress);

            this.logger.debug(`saveAddress: address saved!`, { context: AddressService.name });

        } catch(e) {
            this.logger.error(`saveAddress: failed saving address in database [error=${e.message}]`, { context: AddressService.name });

            throw new BadRequestException('Error when saving address in database');
        }
    }

    /**
     * Verifies the given address using SmartyStreets
     * @param body address to verify
     */
    private async verificateAddress(body: AddressVerificationSO){
        this.logger.error(`verificateAddress: verifying address [address=${JSON.stringify(body)}]`,
            { context: AddressService.name });
        try {
            return await this.addressHttpRepository.postAddressUri(body,{
                "auth-id" : `${process.env.SMARTSTREET_AUTH_KEY}`,
                "auth-token" : `${process.env.SMARTSTREET_AUTH_TOKEN}`
            });
        } catch(e) {
            this.logger.error(`verificateAddress: failed verifying address [address=${JSON.stringify(body)}|e=${e}]`,
                { context: AddressService.name });
                
            throw new Error('Error validating address');
        }
    }

    async checkAddress(address: AddressVerificationRO, body, addressEntityManager: Repository<Address>){
        this.logger.debug(`checkAddress: checking address [address=${JSON.stringify(body)}]`, { context: AddressService.name });
        
        if (address && address[0].metadata.precision === "Unknown") {
            this.logger.debug(`checkAddress: invalid address [address=${JSON.stringify(address)}]|body=${JSON.stringify(body)}]`,
                { context: AddressService.name });

            throw new BadRequestException('Invalid address');
        } else {
            this.saveAddress(body, addressEntityManager);        
            return address;
        }    
    }

    /**
    * Send the request to verify the customer provided address
    * @param body address to verify
    * @returns string
    */
    async addressControl(body: AddressVerificationDto, addressEntityManager) {   
        this.logger.debug(`addressControl: address verification request succesfully [address= ${JSON.stringify(body)}]`,
            { context: AddressService.name });
 
        let addressSO:AddressVerificationSO= {
            'candidates' : 10,match : 'invalid',"street" :  `${body.firstStreet}`,
            "street2" :  `${body.secondStreet}`,"city" :  `${body.cityName}`,
            "state" :  `${body.state}`,"zipcode" : `${body.zipcode}`
        };

        let addressDetail: AddressVerificationRO = await this.verificateAddress(addressSO);   
        this.logger.debug(`addressControl: address verified [addressDetail=${JSON.stringify(addressDetail)}]`, { context: AddressService.name });
        return this.checkAddress(addressDetail, body, addressEntityManager);
    }

    /**
     * This method modifies the customer's current default address
     * @param addressId id of default current address 
     * @param customerId logged in customer id
     * @param addressEntityManager transactional address repository
     */
    async updateAddressDefault(addressId: number, customerId: number, addressEntityManager: Repository<Address>){
        this.logger.info(`updateAddressDefault: modifying default address [addressId=${addressId}|customerId=${customerId}]`,
            { context: AddressService.name });

        let active = STATUS.ACTIVE.id;

        let verifyDefault= await addressEntityManager.findOne({
            where: [{ customer: customerId, status: active, setDefault: true }]
        });

        if (verifyDefault){
            this.logger.info(`updateAddressDefault: user previous default address [address=${JSON.stringify(verifyDefault)}]`,
                { context: AddressService.name });

            verifyDefault.setDefault = false;
            await addressEntityManager.save(verifyDefault);
        }

        let addressCurrentDefault = await addressEntityManager.findOne(addressId);        
        addressCurrentDefault.setDefault = true;
        await addressEntityManager.save(addressCurrentDefault);

        return "Address modified succesfully";
    }

    /**
     * Deletes the given address
     * @param addressId address id to delete
     * @param addressEntityManager 
     */
    async deleteAddress(addressId: number, addressEntityManager: Repository<Address>){
        this.logger.info(`deleteAddress: deleting address [addressId=${addressId}]`, { context: AddressService.name });
        
        let innactiveAddress = await addressEntityManager.findOne({
            where: [{ id: addressId }]
        });

        innactiveAddress.status= await this.statusService.getStatus(STATUS.INACTIVE.id);
        addressEntityManager.save(innactiveAddress);

        this.logger.info(`deleteAddress: address deleted succesfully`, { context: AddressService.name }); 

        return "Address deleted succesfully";
    }

    /**
     * Returns the addresses of a customer
     * @param customerId logged in customer id
     * @param addressEntityManager transactional address repository
     */
    async getAddress(customerId: number, addressEntityManager: Repository<Address>){
        this.logger.info(`getAddress: getting addresses [customerId=${customerId}]`, { context: AddressService.name });

        let active = STATUS.ACTIVE.id; 

        return await addressEntityManager.find({
            where: `customer_id = ${customerId} AND status_id = ${active}`,
        });
    }
}