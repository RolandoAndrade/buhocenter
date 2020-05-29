import { Injectable, HttpService,Inject ,forwardRef } from '@nestjs/common'
import { createQueryBuilder, Repository, EntityManager} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Status } from '../entities/status.entity'
import { StatusHistory } from '../entities/status-history.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable() 
export class StatusService {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@InjectRepository(Status)
		private readonly statusRepository: Repository<Status>,
		@InjectRepository(StatusHistory)
		private readonly statusHistoryRepository: Repository<StatusHistory>,
	){}

	/**
	 * Permite obtener el status dado un id
	 * @param id id del status del cual se desea obtener su entidad
	 */
	public async getStatus(id: number): Promise<Status> {
		this.logger.debug(`getStatus: [id=${id}]`, { context: StatusHistory.name });

		return await this.statusRepository.findOne(id);
	}

	/**
	 * Permite crear una entidad para el historial status
	 * @param statusHistory entidad a almacenar como parte del historial del status
	 * @param transactionalEntityManager entity manager encargado de la ejecución de la transacción
	 */
	public async creatstatusHistory(
		statusHistory,
		transactionalEntityManager: EntityManager,
	): Promise<StatusHistory> {
		this.logger.debug(`creatstatusHistory: [statusHistory=${
			JSON.stringify(statusHistory)}]`, { context: StatusHistory.name });

		const statusHistoryTransactionRepository: Repository<StatusHistory> = transactionalEntityManager.getRepository(
            StatusHistory,
		);
		
		return await statusHistoryTransactionRepository.save(statusHistory);
	}

	public async getStatusHistoryByCheckoutIdAndStatusId(
		checkoutId: number,
		statusId: number
	): Promise<StatusHistory> {
		this.logger.debug(`getStatusHistoryByCheckoutIdAndStatusId: [checkoutId=${
			checkoutId}|statusId=${statusId}]`, { context: StatusHistory.name });

		return this.statusHistoryRepository.findOne({
			where: `checkout_id = ${checkoutId} AND status_id = ${statusId}`,
		})
	}
}
