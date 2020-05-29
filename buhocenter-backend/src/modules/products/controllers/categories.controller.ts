import { Controller, Get, Param, Post, Body, ParseIntPipe, Query, Inject, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {CategoriesService} from '../services/categories.service';
import { Category } from '../entities/category.entity'
import { ProductTransactionsRepository } from '../transaction/products.transaction.service'

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        public service: ProductsService,
        private readonly productTransactionsRepository: ProductTransactionsRepository
    ) {}

    @Get()
    async getCategories(
        @Res() res: Response,
    ): Promise<Response> {
        this.logger.info(
            `getCategories: obteniendo las categorias`,
            { context: CategoriesController.name },
        );
        try {
            const categories: Category[] = await this.categoriesService.getCategories();
            return res.status(HttpStatus.OK).send({categories});
        } catch (e) {
            this.logger.error(
                `getCategories: try catch error [error= ${e.messages}]`,
                { context: CategoriesController.name },
            );
            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Get('/catalogues')
    async getCataloguesByCategory(@Res() res: Response, @Query() query ): Promise<Response> {
        try {
            this.logger.debug(
                `getCataloguesByCategory: Obteniendo catalogues por la category: [id= ${query.category_id}]`,
                { context: CategoriesController.name },
            );
            const catalogues: any = await this.categoriesService.getCataloguesByCatergory(query.category_id);
            return res.status(HttpStatus.OK).send({catalogues});
        } catch (e) {
            this.logger.error(
                `getCataloguesByCategory: try catch error [error= ${e.messages}]`,
                { context: CategoriesController.name },
            );
            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }
}
