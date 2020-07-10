import { Repository } from 'typeorm';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Catalogue } from '../entities/catalogue.entity';
import { STATUS } from '../../../config/constants';
import { StatusService } from '../../status/services/status.service';

@Injectable()
export class CataloguesService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Catalogue)
        private readonly catalogueRepository: Repository<Catalogue>,
        private readonly statusService: StatusService,
    ) {}

    /**
     * getCatalogues
     * @returns Promise<Catalogue[]>
     */
    async getCatalogues(): Promise<Catalogue[]> {
        this.logger.debug(`getCatalogues: Getting all catalogues`, {
            context: CataloguesService.name,
        });

        return await this.catalogueRepository.find({
            where: { status: STATUS.ACTIVE.id },
        });
    }

    /**
     * createCatalogue
     * @param catalogue: Catalogue
     * @returns Promise<Catalogue>
     */
    async createCatalogue(catalogue: Catalogue): Promise<Catalogue> {
        this.logger.debug(`createCatalogue: Creating a Catalogue [catalogueName=${catalogue.name}]`, {
            context: CataloguesService.name,
        });

        switch (true) {
            case catalogue.name === '':
                throw new BadRequestException('The catalogue need a name');
            case !catalogue.category:
                throw new BadRequestException('The catalogue need a category');
            case !catalogue.status:
                throw new BadRequestException('The catalogue need a status');
        }

        return await this.catalogueRepository.save(catalogue);
    }

    /**
     * getCatalogueById
     * @param catalogueId: number
     * @returns Promise<Catalogue>
     */
    async getCatalogueById(catalogueId: number): Promise<Catalogue> {
        this.logger.debug(`getCatalogueById: Getting a catalogue by its id [catalogueId=${catalogueId}]`, {
            context: CataloguesService.name,
        });

        const cataloge = await this.catalogueRepository.findOne({
            where: { id: catalogueId, status: STATUS.ACTIVE.id },
        });

        if (!cataloge) {
            throw new BadRequestException('The catalogue is inactive or inaccessible');
        }

        return cataloge;
    }

    /**
     * deleteCatalogue
     * @param catalogueId: number
     * @returns Promise<Boolean>
     */
    async deleteCatalogue(catalogueId: number): Promise<boolean> {
        this.logger.debug(`deleteCatalogue: Deleting a catalogue [catalogueId=${catalogueId}]`, {
            context: CataloguesService.name,
        });

        const catalogue = await this.getCatalogueById(catalogueId);
        const inactiveStatus = await this.statusService.getStatusById(STATUS.INACTIVE.id);

        catalogue.status = inactiveStatus;
        await this.catalogueRepository.save(catalogue);
        return true;
    }
}
