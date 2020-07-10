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
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductTransactionsRepository } from '../transaction/products.transaction.service';
import { Brand } from '../entities/brand.entity';

@Controller('brands')
export class BrandsController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(ProductTransactionsRepository)
        private readonly productTransactionsRepository: ProductTransactionsRepository,
    ) {}

    @Get()
    async getBrands(@Res() res: Response): Promise<Response> {
        this.logger.info(`getBrands: getting all brands available`, {
            context: BrandsController.name,
        });
        try {
            let response: Brand[] = await this.productTransactionsRepository.getAllBrands();
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.info(`getBrands: error when trying to get all available brands[error=${e.message}]`, {
                context: BrandsController.name,
            });
            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }
}
