import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from '../entities/platform.entity';
import { Repository } from 'typeorm';
import { PLATFORM_PARAMETERS } from '../../../config/constants';

@Injectable()
export class PlatformManagementService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Platform)
        private readonly platformRepository: Repository<Platform>,
    ) {}

    /**
     * Returns the value corresponding to the parameter sent
     * @params parameterId 
     * @returns Promise<Platform>
     */
    public async getPlatformParameterValue(parameterId: number): Promise<Platform> {
        this.logger.debug(`getMinimumInventoryAvailability`, { context: PlatformManagementService.name });

        return this.platformRepository.findOne({
            where: `platform_parameter_id = ${parameterId}`
        })
    }
}
