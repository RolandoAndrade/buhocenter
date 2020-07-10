import {
    Controller,
    Get,
    Post,
    Res,
    Body,
    HttpStatus,
    Inject,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AddressVerificationDto, AddressUDDto } from '../dto/AddressVerification.dto';
import { AddressService } from '../services/address.service';
import { Response } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AddressTransactionsRepository } from '../transaction/address.transactions.service';
import { AuthGuard } from '@nestjs/passport';

//@UseGuards(AuthGuard('jwt'))
@Controller('address')
export class AddressController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly addressTransactionRepository: AddressTransactionsRepository,
        private readonly addressService: AddressService,
    ) {}

    @Post('verification')
    async validateAddress(@Body() address: AddressVerificationDto): Promise<Response> {
        this.logger.info(`validateAddress: validating address [address=${JSON.stringify(address)}]`, {
            context: AddressController.name,
        });
        return await this.addressTransactionRepository.validateAddress(address);
    }

    @Patch()
    async setDefaultAddress(@Res() res: Response, @Body() address: AddressUDDto): Promise<Response> {
        this.logger.info(`setDefaultAddress: [address=${JSON.stringify(address)}]`, {
            context: AddressController.name,
        });

        try {
            let response = await this.addressTransactionRepository.setDefaultAddress(address);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `setDefaultAddress: error setting default address [error=${JSON.stringify(e.message)}]`,
                { context: AddressController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send(e.message);
        }
    }

    @Delete(':id')
    async deleteAddress(@Res() res: Response, @Param('id') id: number): Promise<Response> {
        this.logger.info(`deleteAddress: [addressId=${id}]`, {
            context: AddressController.name,
        });

        try {
            let response = await this.addressService.deleteAddress(id);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `deleteAddress: error when trying to delete an address [error=${JSON.stringify(
                    e.message,
                )}]})`,
                { context: AddressController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send(e.message);
        }
    }

    @Get()
    async getAddresses(@Res() res: Response, @Query('customerId') customerId: number): Promise<Response> {
        this.logger.info(`getAddresses: [customerId=${customerId}]`, {
            context: AddressController.name,
        });

        try {
            let response = await this.addressService.getAddresses(customerId);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `getAddresses: error getting customer address [error=${JSON.stringify(e.message)}]`,
                { context: AddressController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send(e.message);
        }
    }
}
