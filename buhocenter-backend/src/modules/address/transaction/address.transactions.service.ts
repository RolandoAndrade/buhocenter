import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectConnection } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { Connection, Repository } from 'typeorm';
import { AddressService } from '../services/address.service';
import { AddressUDDto } from '../dto/AddressVerification.dto';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressTransactionsRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection,
        private readonly addressService: AddressService,
    ) {}

    /**
     * Updates default address which the new given address
     * @param address new address to set as default
     */
    public async setDefaultAddress(address: AddressUDDto): Promise<string> {
        this.logger.info(
            `updateAddressDefault: setting default address process [address=${JSON.stringify(address)}]`,
            { context: AddressTransactionsRepository.name },
        );

        return await this.connection.transaction(async transactionalEntityManager => {
            try {
                const addressTransactionRepository: Repository<Address> = transactionalEntityManager.getRepository(
                    Address,
                );
                return await this.addressService.updateAddressDefault(
                    address.id,
                    address.user.id,
                    addressTransactionRepository,
                );
            } catch (e) {
                this.logger.error(`Error setting default address [e=${e}]`, {
                    context: AddressTransactionsRepository.name,
                });
            }
        });
    }

    /**
     * Validates the given address
     * @param address address to verify
     */
    public async validateAddress(address): Promise<any> {
        this.logger.info(`validateAddress: validating address... [address=${JSON.stringify(address)}]`, {
            context: AddressTransactionsRepository.name,
        });

        return this.connection.transaction(async transactionalEntityManager => {
            try {
                const addressTransactionRepository: Repository<Address> = transactionalEntityManager.getRepository(
                    Address,
                );
                return await this.addressService.addressControl(address, addressTransactionRepository);
            } catch (e) {
                this.logger.error(`Error validating address [e=${e}]`, {
                    context: AddressTransactionsRepository.name,
                });
                throw new BadRequestException('Invalid address');
            }
        });
    }
}
