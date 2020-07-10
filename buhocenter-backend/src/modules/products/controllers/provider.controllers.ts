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
import { Provider } from '../entities/provider.entity';

@Controller('providers')
export class ProvidersController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(ProductTransactionsRepository)
        private readonly productTransactionsRepository: ProductTransactionsRepository,
    ) {}

    @Get()
    async getProviders(@Res() res: Response): Promise<Response> {
        this.logger.info(`getProviders: getting all accesible brands `, {
            context: ProvidersController.name,
        });
        try {
            let response: Provider[] = await this.productTransactionsRepository.getAllProviders();
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.info(
                `getProviders:error when trying to get all accessible brands[error=${e.message}]`,
                { context: ProvidersController.name },
            );
            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }
}
