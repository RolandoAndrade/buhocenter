import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Repository, EntityManager } from 'typeorm';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Logger } from 'winston';
import { StatusService } from '../../status/services/status.service';
import { STATUS } from '../../../config/constants';
import { Commission } from '../entities/commission.entity';
import { CommissionDto, CommissionUpdateDto } from '../dto/commissions.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommissionsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
        @InjectRepository(Commission)
        private readonly _commissionRepository: Repository<Commission>,
        private readonly _statusService: StatusService,
    ) {}

    /**
     * getActiveCommission
     * Allows get a commission that have the ACTIVE status
     * @retuns Promise<Commission>
     */
    async getActiveCommission(): Promise<Commission> {
        this._logger.debug(`getActiveCommission: Getting a active commission`, {
            context: CommissionsService.name,
        });

        return await this._commissionRepository
            .createQueryBuilder('commission')
            .innerJoin('commission.status', 'status')
            .where('status.id = :statusId', { statusId: STATUS.ACTIVE.id })
            .getOne();
    }

    public async createCommission(CommissionData: CommissionDto, transactionalEntityManager: EntityManager) {
        try {
            const newCommission = new Commission();
            newCommission.serviceFee = CommissionData.serviceFee;
            newCommission.processorFee = CommissionData.processorFee;
            newCommission.status = await this._statusService.getStatusById(STATUS.ACTIVE.id);
            let lastCommission;

            if (CommissionData.serviceFee == 0) {
                lastCommission = await this.getLastCommission();
                newCommission.serviceFee = lastCommission.serviceFee;
            }
            if (CommissionData.processorFee == 0) {
                lastCommission = await this.getLastCommission();
                newCommission.processorFee = lastCommission.processorFee;
            }

            const CommissionTransactionalRepository = await transactionalEntityManager.getRepository(
                Commission,
            );
            await CommissionTransactionalRepository.save(newCommission);
            return newCommission;
        } catch (e) {
            this._logger.error(
                `createCommision: error when trying to create the commission [commisionsInfo=${JSON.stringify(
                    CommissionData,
                )}]`,
                { context: CommissionsService.name },
            );

            throw new BadRequestException('Error when creating commission in the database');
        }
    }

    public async updateServiceFee(
        commissionId: number,
        newServiceFee: number,
        CommissionTransactionalRepository,
    ): Promise<void> {
        await CommissionTransactionalRepository.update({ id: commissionId }, { serviceFee: newServiceFee });
    }

    public async updateProcessorFee(
        commissionId: number,
        newProcessorFee: number,
        CommissionTransactionalRepository,
    ): Promise<void> {
        await CommissionTransactionalRepository.update(
            { id: commissionId },
            { processorFee: newProcessorFee },
        );
    }

    public async updateCommission(
        CommissionData: CommissionUpdateDto,
        transactionalEntityManager: EntityManager,
    ): Promise<string> {
        const CommissionTransactionalRepository = await transactionalEntityManager.getRepository(Commission);

        if (CommissionData.serviceFee > 0) {
            await this.updateServiceFee(
                CommissionData.id,
                CommissionData.serviceFee,
                CommissionTransactionalRepository,
            );
        }
        if (CommissionData.processorFee > 0) {
            await this.updateProcessorFee(
                CommissionData.id,
                CommissionData.processorFee,
                CommissionTransactionalRepository,
            );
        }

        return 'Commission updated';
    }

    public async deleteCommission(
        commissionId: number,
        transactionalEntityManager: EntityManager,
    ): Promise<boolean> {
        try {
            const inactive = await this._statusService.getStatusById(STATUS.INACTIVE.id);
            const CommissionTransactionalRepository: Repository<Commission> = await transactionalEntityManager.getRepository(
                Commission,
            );
            await CommissionTransactionalRepository.update({ id: commissionId }, { status: inactive });
            return true;
        } catch (e) {
            this._logger.error(
                `deleteCommision: error when trying to delete the commission [commisionsId=${commissionId}]`,
                { context: CommissionsService.name },
            );
        }
    }

    public async getCommissionById(commissionId: number): Promise<Commission> {
        const active = await this._statusService.getStatusById(STATUS.ACTIVE.id);
        return await this._commissionRepository.findOne({
            where: { id: commissionId, status: active },
        });
    }

    public async getCommission(): Promise<Commission[]> {
        const active = STATUS.ACTIVE.id;
        return await this._commissionRepository.find({
            where: { status: active },
        });
    }

    public async getLastCommission(): Promise<Commission> {
        return await this._commissionRepository.findOne({
            order: { id: 'DESC' },
        });
    }
}
