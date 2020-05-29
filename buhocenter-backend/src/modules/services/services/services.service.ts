import { Injectable, Inject } from '@nestjs/common';
import { Service } from '../entities/service.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { ServiceRating } from '../entities/service-rating.entity';

@Injectable()
export class ServicesService {
    
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Service)
        private readonly servicesRepository: Repository<Service>,
        @InjectRepository(ServiceRating)
        private readonly serviceRatingsRepository: Repository<ServiceRating>,
    ) {}


    /**
     * Returns the appreciations emitted to a service array
     * @param services services array to obtain its appreciations
     * @returns Promise<void>
     */
    private async getServiceAverageRating(services: Service[]): Promise<void> {
        this.logger.debug(`getServiceAverageRating: obtiene el promedio de ratings de los services`,
            { context: ServicesService.name });

        for await (const service of services) {
            service.serviceRatings = await this.serviceRatingsRepository.query(`
                SELECT ROUND(AVG(CS.rating)) as rating, COUNT(*) as total
                FROM service_rating CS
                WHERE CS.service_id = ${service.id}
            `.trim())

            this.logger.debug(`getServiceAverageRating [id=${service.id}|serviceRatings=${
                JSON.stringify(service.serviceRatings)}]`, { context: ServicesService.name });
        }
    }

    /**
     * Returns the service and its properties according to its id
     * @param id service id
     * @returns Promise<Service>
     */
    public async getServiceById(id: number): Promise<Service> {
        this.logger.debug(`getServiceById: [id=${id}]`, { context: ServicesService.name });

        const service: Service = await this.servicesRepository.findOne({
            where: { id },
            relations: [
                'photos',
                'questions',
                'offers',
                'offers.offer',
                'offers.offer.status',
                'serviceProvider',
                'serviceProvider.provider',
            ],
        });

        await this.getServiceAverageRating([service]);

        return service;
    }

  
    /**
     * Returns the service according to its id
     * @param ServiceId service id
     */
    async findService(ServiceId: number): Promise<Service> {
        this.logger.debug(`getServiceById: [id=${ServiceId}]`, { context: ServicesService.name });

        return await this.servicesRepository.findOne(ServiceId);
    }
}
