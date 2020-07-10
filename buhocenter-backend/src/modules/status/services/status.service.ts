import { Injectable, HttpService, Inject, forwardRef } from '@nestjs/common';
import { createQueryBuilder, Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../entities/status.entity';
import { StatusHistory } from '../entities/status-history.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class StatusService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
        @InjectRepository(Status)
        private readonly _statusRepository: Repository<Status>,
        @InjectRepository(StatusHistory)
        private readonly statusHistoryRepository: Repository<StatusHistory>,
    ) {}

    /**
     * getStatusById
     * Allows get a status by Id
     * @param statusId
     * @returns Promise<Status>
     */
    public async getStatusById(statusId: number): Promise<Status> {
        this._logger.debug(`getStatusById: Getting a status by Id [statusId=${statusId}]`, {
            context: StatusService.name,
        });

        return await this._statusRepository.findOne(statusId);
    }

    /**
     * getStatusByName
     * @param statusName: string
     * @returns Promise<Status>
     */
    async getStatusByName(statusName: string): Promise<Status> {
        this._logger.debug(`getStatusByName: Getting a status by name [statusName=${statusName}]`, {
            context: StatusService.name,
        });

        return await this._statusRepository
            .createQueryBuilder('status')
            .where('UPPER(status.name) LIKE :statusName', {
                statusName: `${statusName.toUpperCase()}`,
            })
            .getOne();
    }

    /**
     * Permite crear una entidad para el historial status
     * @param statusHistory entidad a almacenar como parte del historial del status
     * @param transactionalEntityManager entity manager encargado de la ejecución de la transacción
     */

    public async createStatusHistory(
        statusHistory,
        transactionalEntityManager: EntityManager,
    ): Promise<StatusHistory> {
        this._logger.debug(`createStatusHistory: [statusHistory=${JSON.stringify(statusHistory)}]`, {
            context: StatusHistory.name,
        });

        const statusHistoryTransactionRepository: Repository<StatusHistory> = transactionalEntityManager.getRepository(
            StatusHistory,
        );

        return await statusHistoryTransactionRepository.save(statusHistory);
    }

    public async getStatusHistoryByCheckoutIdAndStatusId(
        checkoutId: number,
        statusId: number,
    ): Promise<StatusHistory> {
        this._logger.debug(
            `getStatusHistoryByCheckoutIdAndStatusId: [checkoutId=${checkoutId}|statusId=${statusId}]`,
            { context: StatusHistory.name },
        );

        return this.statusHistoryRepository.findOne({
            where: `checkout_id = ${checkoutId} AND status_id = ${statusId}`,
        });
    }
}
