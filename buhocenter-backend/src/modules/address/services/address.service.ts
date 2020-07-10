import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import {
    AddressVerificationDto,
    AddressVerificationRO,
    AddressVerificationSO,
} from '../dto/AddressVerification.dto';
import { Address } from '../entities/address.entity';
import { AddressValidationRepository } from '../repositories/address.repository';
import { UsersService } from '../../users/services/users.service';
import { STATUS } from '../../../config/constants';
import { StatusService } from '../../status/services/status.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
        private readonly usersService: UsersService,
        private readonly statusService: StatusService,
        private readonly addressValidationRepository: AddressValidationRepository,
        @InjectRepository(Address) private addressRepository: Repository<Address>,
    ) {}

    /**
     * Checks if a given user has a default address
     * @param userId user id to check if it has default address
     * @param addressEntityManager transactional address repository
     */
    private async userHasDefaultAddress(userId: number) {
        this._logger.debug(`userHasDefaultAddress: checking user addresses [userId=${userId}]`, {
            context: AddressService.name,
        });

        const defaultAddress: Address = await this.addressRepository.findOne({
            where: { user: userId, status: STATUS.ACTIVE.id },
        });

        if (defaultAddress) {
            return true;
        }

        return false;
    }

    /**
     * Saves the given address in database
     * @param address address to save in database
     * @param addressEntityManager transactional address repository
     */
    private async saveAddress(
        address: AddressVerificationDto,
        addressEntityManager: Repository<Address>,
    ): Promise<void> {
        this._logger.debug(`saveAddress: saving address [address=${JSON.stringify(address)}]`, {
            context: AddressService.name,
        });

        try {
            const hasDefaultAddress: boolean = await this.userHasDefaultAddress(address.user.id);

            const newAddress: Partial<Address> = {
                firstStreet: address.firstStreet,
                secondStreet: address.secondStreet,
                city: address.cityName,
                state: address.state,
                zipcode: address.zipcode,
                user: await this.usersService.getUserById(address.user.id),
                status: await this.statusService.getStatusById(STATUS.ACTIVE.id),
                setDefault: !hasDefaultAddress,
            };

            await addressEntityManager.save(newAddress);

            this._logger.debug(`saveAddress: address saved!`, {
                context: AddressService.name,
            });
        } catch (e) {
            this._logger.error(`saveAddress: failed saving address in database [error=${e.message}]`, {
                context: AddressService.name,
            });

            throw new BadRequestException('Error when saving address in database');
        }
    }

    /**
     * Verifies the given address using SmartyStreets
     * @param body address to verify
     */
    private async verificateAddress(body: AddressVerificationSO) {
        this._logger.debug(`verificateAddress: verifying address [address=${JSON.stringify(body)}]`, {
            context: AddressService.name,
        });
        return await this.addressValidationRepository.postAddressUri(body);
    }

    async checkAddress(
        addressRecibeByAPIValidator: AddressVerificationRO,
        addressSent: AddressVerificationDto,
        addressEntityManager: Repository<Address>,
    ) {
        this._logger.debug(`checkAddress: checking address [address=${JSON.stringify(addressSent)}]`, {
            context: AddressService.name,
        });

        if (this.addressValidationAnalysis(addressRecibeByAPIValidator)) {
            await this.saveAddress(addressSent, addressEntityManager);
            return addressRecibeByAPIValidator;
        } else {
            this._logger.debug(
                `checkAddress: invalid address [address=${JSON.stringify(
                    addressRecibeByAPIValidator,
                )}]|addressSent=${JSON.stringify(addressSent)}]`,
                { context: AddressService.name },
            );
            throw new BadRequestException('Invalid address');
        }
    }

    /**
     * Send the request to verify the customer provided address
     * @param body address to verify
     * @param addressEntityManager
     * @returns string
     */
    public async addressControl(body: AddressVerificationDto, addressEntityManager) {
        this._logger.debug(
            `addressControl: address sending request to validate address [address= ${JSON.stringify(body)}]`,
            { context: AddressService.name },
        );

        const addressSO: AddressVerificationSO = {
            candidates: 1,
            match: 'strict',
            street: `${body.firstStreet}`,
            street2: `${body.secondStreet}`,
            city: `${body.cityName}`,
            state: `${body.state}`,
            zipcode: `${body.zipcode}`,
        };

        const addressDetail: AddressVerificationRO = await this.verificateAddress(addressSO);

        this._logger.debug(
            `addressControl: address verified [addressDetail=${JSON.stringify(addressDetail)}]`,
            { context: AddressService.name },
        );
        return this.checkAddress(addressDetail, body, addressEntityManager);
    }

    /**
     * This method modifies the customer's current default address
     * @param addressId id of default current address
     * @param customerId logged in customer id
     * @param addressEntityManager transactional address repository
     */
    async updateAddressDefault(
        addressId: number,
        customerId: number,
        addressEntityManager: Repository<Address>,
    ) {
        this._logger.info(
            `updateAddressDefault: modifying default address [addressId=${addressId}|customerId=${customerId}]`,
            { context: AddressService.name },
        );

        const active = STATUS.ACTIVE.id;

        const verifyDefault = await addressEntityManager.findOne({
            where: [{ user: customerId, status: active, setDefault: true }],
        });

        if (verifyDefault) {
            this._logger.info(
                `updateAddressDefault: user previous default address [address=${JSON.stringify(
                    verifyDefault,
                )}]`,
                { context: AddressService.name },
            );

            verifyDefault.setDefault = false;
            await addressEntityManager.save(verifyDefault);
        }

        const addressCurrentDefault = await addressEntityManager.findOne(addressId);
        addressCurrentDefault.setDefault = true;
        await addressEntityManager.save(addressCurrentDefault);

        return 'Address modified succesfully';
    }

    /**
     * Deletes the given address
     * @param id address id to delete
     */
    async deleteAddress(id: number): Promise<UpdateResult> {
        this._logger.info(`deleteAddress: deleting address [id=${id}]`, {
            context: AddressService.name,
        });

        return await this.addressRepository.update({ id }, { status: { id: STATUS.INACTIVE.id } });
    }

    /**
     * Returns the addresses of a user
     * @param userId logged in user id
     */
    async getAddresses(userId: number): Promise<Address[]> {
        this._logger.info(`getAddress: getting addresses [userId=${userId}]`, {
            context: AddressService.name,
        });

        return await this.addressRepository.find({
            where: { user: { id: userId }, status: { id: STATUS.ACTIVE.id } },
        });
    }

    private addressValidationAnalysis(address): boolean {
        if (address) {
            if (address.length) {
                if (address[0].metadata.precision === 'Unknown') {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }
}
