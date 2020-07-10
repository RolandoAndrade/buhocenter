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
    UseInterceptors,
    Put,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import {
    ProductDTO,
    ProductsAO,
    IdArrayDto,
    ImageProductDto,
    DimensionProductDto,
    InventoryProductDto,
} from '../dto/products.dto';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductTransactionsRepository } from '../transaction/products.transaction.service';
import { ProductParameters } from '../interfaces/product-parameters';
import { PaginatedProducts } from '../interfaces/paginated-products';
import { CustomerLoyaltyInterceptor } from '../../../common/customer-loyalty-product-points.interceptor';
import { DeleteResult } from 'typeorm';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(ProductTransactionsRepository)
        private readonly productTransactionsRepository: ProductTransactionsRepository,
    ) {}

    @Post()
    async createProduct(@Body() product: Partial<Product>): Promise<Product> {
        this.logger.info(`createProduct: Creating a product`, {
            context: ProductsController.name,
        });
        return await this.productsService.createProduct(product);
    }

    @Get('daily-recommendation')
    @UseInterceptors(CustomerLoyaltyInterceptor)
    async getDailyProductsRecommendation(): Promise<Product[]> {
        this.logger.info(`getDailyProductsRecommendation: products recomendados del dia `, {
            context: ProductsController.name,
        });

        return this.productsService.getDailyProductsRecommendation();
    }

    @Get('all')
    async getAllProducts(): Promise<Product[]> {
        this.logger.info(`getAllProducts: getting all accessibles products`, {
            context: ProductsController.name,
        });

        return await this.productsService.getAllProducts();
    }

    @Get(':id')
    @UseInterceptors(CustomerLoyaltyInterceptor)
    async getProductById(@Param('id', new ParseIntPipe()) id: number): Promise<Product> {
        this.logger.info(`getProductById: getting the product with id [id=${id}]`, {
            context: ProductsController.name,
        });

        return this.productsService.getProductById(id);
    }

    @Get()
    @UseInterceptors(CustomerLoyaltyInterceptor)
    getProducts(@Query() parameters: ProductParameters): Promise<PaginatedProducts> {
        this.logger.info('getProducts: Getting products by a set of parameters', {
            context: ProductsController.name,
        });

        return this.productsService.getProducts(parameters);
    }

    @Patch()
    async updateProductData(
        @Res() res: Response,
        @Body() updateProduct: Partial<ProductsAO>,
    ): Promise<Response> {
        try {
            this.logger.info(
                `
				updateProductData : updating the product [updateProduct=${JSON.stringify(updateProduct)}]`,
                { context: ProductsController.name },
            );
            let response = await this.productTransactionsRepository.updateProductData(updateProduct);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `updateProductData: error when loading the object[error=${JSON.stringify(e.message)}]`,
                { context: ProductsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Put()
    async updateProduct(@Body() product: Partial<Product>): Promise<Product> {
        console.log('controlador', product);
        this.logger.info(`updateProduct: Updating the product [productId=${product.id}]`, {
            context: ProductsController.name,
        });
        return await this.productsService.updateProduct(product);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') productId: number): Promise<Boolean> {
        this.logger.info(`deleteProduct: Deleting the product with id [productId=${productId}]`, {
            context: ProductsController.name,
        });

        return await this.productsService.deleteProduct(productId);
    }

    @Post('image')
    async saveProductImage(@Res() res: Response, @Body() data: ImageProductDto): Promise<Response> {
        try {
            this.logger.info(`saveProductImage:creating the imageName [product=${JSON.stringify(data)}]`, {
                context: ProductsController.name,
            });

            let response = await this.productTransactionsRepository.saveProductImage(data.imageName, data.id);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `saveProductImage: error when trying to associate product and image=${JSON.stringify(
                    e.message,
                )}`,
                { context: ProductsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Post('dimension')
    async saveProductDimension(@Res() res: Response, @Body() data: DimensionProductDto) {
        try {
            this.logger.info(
                `saveProductDimension:creating the dimension for producto [product=${JSON.stringify(data)}]`,
                { context: ProductsController.name },
            );

            let response = await this.productTransactionsRepository.saveProductDimension(
                data.dimension,
                data.id,
            );
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `saveProductDimension: error when trying to associate product and dimension=${JSON.stringify(
                    e.message,
                )}`,
                { context: ProductsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Post('inventory')
    async saveInventary(@Res() res: Response, @Body() data: InventoryProductDto): Promise<Response> {
        try {
            this.logger.info(`saveInventary:saving the inventory with id [product=${JSON.stringify(data)}]`, {
                context: ProductsController.name,
            });

            let response = await this.productTransactionsRepository.saveInventary(data);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `saveInventary: error when trying to associate quantity to product =${JSON.stringify(
                    e.message,
                )}`,
                { context: ProductsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Patch('inventory')
    async updateInventory(@Res() res: Response, @Body() data: InventoryProductDto): Promise<Response> {
        try {
            this.logger.info(
                `updateInventory:updating the inventory with id [product=${JSON.stringify(data)}]`,
                { context: ProductsController.name },
            );

            let response = await this.productTransactionsRepository.updateInventory(data);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            this.logger.error(
                `updateInventory: error when trying to update inventory=${JSON.stringify(e.message)}`,
                { context: ProductsController.name },
            );

            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Post('/question')
    async addQuestionToProduct(@Res() res: Response, @Body() questionAndProduct): Promise<Response> {
        this.logger.info(
            `addQuestionToProduct:adding the question to the product with id [questionAndProduct=${JSON.stringify(
                questionAndProduct,
            )}]`,
            { context: ProductsController.name },
        );

        let response = await this.productsService.addQuestionToProduct(questionAndProduct);
        return res.status(HttpStatus.OK).send(response);
    }

    @Delete()
    async deleteQuestionInProduct(
        @Res() res: Response,
        @Query('questionId', new ParseIntPipe()) questionId: number,
    ): Promise<Response> {
        this.logger.info(`deleteQuestionInProduct:deleting the question with id [questionId=${questionId}]`, {
            context: ProductsController.name,
        });

        let response = await this.productsService.deleteQuestionInProduct(questionId);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get('/question/:id')
    async getAllQuestionsInProduct(@Res() res: Response, @Param('id') productId: number): Promise<Response> {
        this.logger.info(
            `deleteQuestionInProduct:getting all the questions in the product with id [productId=${productId}]`,
            { context: ProductsController.name },
        );

        let response = await this.productsService.getAllQuestionsInProduct(productId);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get('facture/:id')
    async generateOrderPDF(@Res() res: Response, @Param('id') paymentId: number): Promise<any> {
        const path = require('path');
        this.logger.info(`generateOrderPDF: generating pdf of the order with id [dirname=${paymentId})]`, {
            context: ProductsController.name,
        });

        let response = this.productsService.createPdf(paymentId).then(() => {
            const fs = require('fs');

            const filePath = path.resolve(__dirname + '../../../../../reports/pdfs/' + paymentId + '.pdf');

            const stream = fs.createReadStream(filePath);
            res.writeHead(200, {
                'Content-disposition':
                    'attachment; filename="' + encodeURIComponent(path.basename(filePath)) + '"',
                'Content-type': 'application/pdf',
            });

            stream.pipe(res);
        });
    }

    @Get('facture/view/:id')
    async viewOrderPDF(@Res() res: Response, @Param('id') paymentId: number): Promise<any> {
        const path = require('path');
        this.logger.info(`generateOrderPDF: generating pdf of the order with id [dirname=${paymentId})]`, {
            context: ProductsController.name,
        });

        let response = this.productsService.viewPdf(paymentId, res);
    }
}
