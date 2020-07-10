import {
    Controller,
    Inject,
    Get,
    Res,
    Param,
    ParseIntPipe,
    HttpStatus,
    Post,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CommissionsService } from '../services/commissions.service';
import { CommissionsTransactionsRepository } from '../transactions/commissions.transactions.service';
import { CommissionDto, CommissionUpdateDto } from '../dto/commissions.dto';
import { join } from 'path';

@Controller('commissions')
export class CommissionsController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly commissionsService: CommissionsService,
        private readonly CommissionsTransactionsRepository: CommissionsTransactionsRepository,
    ) {}

    @Post()
    async createCommissions(@Res() res: Response, @Body() data: CommissionDto): Promise<Response> {
        try {
            this.logger.info(
                `createCommissions: creating the new commission [data=${JSON.stringify(data)}]`,
                { context: CommissionsController.name },
            );

            let response = await this.CommissionsTransactionsRepository.createCommission(data);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `createCommissions: error when trying to create new commissions=${JSON.stringify(e.message)}`,
                { context: CommissionsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Delete('/:id')
    async deleteCommissions(@Res() res: Response, @Param('id') commissionId: number): Promise<Response> {
        try {
            this.logger.info(
                `deleteCommissions: deleting the commission with id [commissio=${commissionId}]`,
                { context: CommissionsController.name },
            );

            let response = await this.CommissionsTransactionsRepository.deleteCommission(commissionId);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `deleteCommissions: error when trying to delete a commission =${JSON.stringify(e.message)}`,
                { context: CommissionsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Patch()
    async updateCommissions(@Res() res: Response, @Body() data: CommissionUpdateDto): Promise<Response> {
        try {
            this.logger.info(
                `updateCommissions:updating the Commission [commission=${JSON.stringify(data)}]`,
                { context: CommissionsController.name },
            );

            let response = await this.CommissionsTransactionsRepository.updateCommission(data);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `updateCommissions: error when trying to update Commission = ${JSON.stringify(e.message)}`,
                { context: CommissionsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Get()
    async getAllCommissions(@Res() res: Response): Promise<Response> {
        try {
            this.logger.info(`getAllCommissions:getting all availables commissions `, {
                context: CommissionsController.name,
            });

            let response = await this.commissionsService.getCommission();
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `getAllCommissions: error when trying to get all availables commissions=${JSON.stringify(
                    e.message,
                )}`,
                { context: CommissionsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Get('/:id')
    async getCommissionById(@Res() res: Response, @Param('id') commissionId: number): Promise<Response> {
        try {
            this.logger.info(`getCommissionById:getting commission by id [product=${commissionId}]`, {
                context: CommissionsController.name,
            });

            let response = await this.commissionsService.getCommissionById(commissionId);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `getCommissionById: error when trying to get commission by id=${JSON.stringify(e.message)}`,
                { context: CommissionsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }
}
