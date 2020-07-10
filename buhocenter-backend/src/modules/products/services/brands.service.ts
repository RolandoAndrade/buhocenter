import { createQueryBuilder, Repository } from 'typeorm';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { STATUS } from '../../../config/constants';
import { Brand } from '../entities/brand.entity';
import { Status } from '../../status/entities/status.entity';
import { StatusService } from '../../status/services/status.service';

@Injectable()
export class BrandsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
        @Inject(StatusService)
        private readonly statusService: StatusService,
    ) {}

    public async getAllBrands(): Promise<Brand[]> {
        return await this.brandRepository.find();
    }

    public async getBrand(brandId: number): Promise<Brand> {
        return await this.brandRepository.findOne(brandId);
    }
}
