import { Injectable, Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { InjectConnection } from "@nestjs/typeorm";
import { Logger } from "winston";
import { Connection } from 'typeorm';
import { AddressService } from "../services/address.service";
import { AddressUDDto } from '../dto/AddressVerification.dto'
import { Address } from '../entities/address.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';

@Injectable()
export class AddressTransactionsRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection,
        private readonly addressService: AddressService,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) {}

    /**
     * Updates default address which the new given address
     * @param address new address to set as default
     */
    public async updateAddressDefault(address:  AddressUDDto): Promise<string> {
        this.logger.info(`updateAddressDefault: setting default address process [address=${JSON.stringify(address)}]`,
            { context: AddressTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.addressService.updateAddressDefault(address.id,address.customer.id, this.addressRepository);
        })
    }

    /**
     * Deletes the given address
     * @param addressId address id to delete
     */
    public async deleteAddress(addressId: number): Promise<string> {
        this.logger.info(`deleteAddress: starting deleting process [addressId=${addressId}]`,
            { context: AddressTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManager => {
            return await this.addressService.deleteAddress(addressId, this.addressRepository);
        })
    }

    /**
     * Returns the customer addresses
     * @param customerId customer id to return the addresses
     */
    public async getUserAddress(customerId : number): Promise<any> {
        this.logger.info(`getUserAddress: getting customer addresses [usersAddress=${customerId}]`,
            { context: AddressTransactionsRepository.name });

        return this.connection.transaction(async transactionalEntityManager => {
            return await this.addressService.getAddress(customerId, this.addressRepository);
        })
    }

    /**
     * Verify the given address
     * @param address address to verify
     */
    public async verifyAddress(address): Promise<any>{
         this.logger.info(`verifyAddress: starting process to verify address [address=${JSON.stringify(address)}]`,
            { context: AddressTransactionsRepository.name });

        return this.connection.transaction(async transactionalEntityManager => {
            return await this.addressService.addressControl(address, this.addressRepository);
        })
    }
}