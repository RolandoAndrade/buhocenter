import { Injectable, Inject } from '@nestjs/common';
import { getManager, getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectConnection } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { Connection } from 'typeorm';
import { CommissionsService } from '../services/commissions.service';
import { CommissionDto, CommissionUpdateDto } from '../dto/commissions.dto';

@Injectable()
export class CommissionsTransactionsRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection,
        private readonly commissionsService: CommissionsService,
    ) {}

    public async createCommission(data: CommissionDto): Promise<any> {
        this.logger.debug(`createCommission: starting process to create a new commission`, {
            context: CommissionsTransactionsRepository.name,
        });

        return await this.connection.transaction(async transactionalEntityManager => {
            return await this.commissionsService.createCommission(data, transactionalEntityManager);
        });
    }

    public async deleteCommission(commissionId: number): Promise<any> {
        this.logger.debug(`deleteCommission: starting process to delete a new commission`, {
            context: CommissionsTransactionsRepository.name,
        });

        return await this.connection.transaction(async transactionalEntityManager => {
            return await this.commissionsService.deleteCommission(commissionId, transactionalEntityManager);
        });
    }

    public async updateCommission(data: CommissionUpdateDto): Promise<any> {
        this.logger.debug(`updateCommission: starting process to update a new commission`, {
            context: CommissionsTransactionsRepository.name,
        });

        return await this.connection.transaction(async transactionalEntityManager => {
            return await this.commissionsService.updateCommission(data, transactionalEntityManager);
        });
    }
}
