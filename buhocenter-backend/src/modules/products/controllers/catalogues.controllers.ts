import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    ParseIntPipe,
    Query,
    Inject,
    Res,
    HttpStatus,
    Patch,
    Delete,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductTransactionsRepository } from '../transaction/products.transaction.service';
import { Brand } from '../entities/brand.entity';
import { categoryDto } from '../dto/products.dto';
import { Catalogue } from '../entities/catalogue.entity';
import { CataloguesService } from '../services/catalogues.service';

@Controller('catalogues')
export class CataloguesController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(ProductTransactionsRepository)
        private readonly productTransactionsRepository: ProductTransactionsRepository,
        private readonly cataloguesService: CataloguesService,
    ) {}

    @Get()
    async getCatalogues(@Res() res: Response): Promise<Response> {
        this.logger.info(`getCatalogues: getting all Catalogues available`, {
            context: CataloguesController.name,
        });
        try {
            let catalogues = await this.productTransactionsRepository.getCatalogues();
            return res.status(HttpStatus.OK).send({ catalogues });
        } catch (e) {
            this.logger.info(
                `getCatalogues: error when trying to get all available Catalogues[error=${e.message}]`,
                { context: CataloguesController.name },
            );
            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Post()
    async createCatalogue(@Body() catalogue: Catalogue): Promise<Catalogue> {
        this.logger.info(`createCatalogue: Creating a catalogue `, {
            context: CataloguesController.name,
        });

        return await this.cataloguesService.createCatalogue(catalogue);
    }

    @Delete(':id')
    async deleteCatalogue(@Param('id', new ParseIntPipe()) catalogueId: number): Promise<Boolean> {
        this.logger.info(`deleteCatalogue: Deleting a catalogue `, {
            context: CataloguesController.name,
        });

        return await this.cataloguesService.deleteCatalogue(catalogueId);
    }
}
