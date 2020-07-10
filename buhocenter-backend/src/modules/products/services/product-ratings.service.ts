import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRating } from '../entities/product-rating.entity';
import { Repository, getManager } from 'typeorm';
import { ProductsService } from './products.service';

@Injectable()
export class ProductRatingsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(ProductRating)
        private readonly productRatingRepository: Repository<ProductRating>,
        private readonly productService: ProductsService,
    ) {}

    /**
     * createProductRating
     * @param productRating: Partial<ProductRating>
     * @returns Promise<ProductRating>
     */
    async createProductRating(productRating: Partial<ProductRating>): Promise<ProductRating> {
        this.logger.debug(
            `createProductRating: Creating a product rating [productRating=${JSON.stringify(productRating)}]`,
            {
                context: ProductRatingsService.name,
            },
        );

        return await getManager().transaction(async transactionEntityManager => {
            try {
                const productRatingTransactionRepository: Repository<ProductRating> = transactionEntityManager.getRepository(
                    ProductRating,
                );
                const newProductRating = await productRatingTransactionRepository.save(productRating);
                await this.productService.updateProductRating(
                    productRating.product,
                    transactionEntityManager,
                );
                return newProductRating;
            } catch (error) {
                throw error;
            }
        });
    }

    /**
     * getProductRatingsByProductId
     * @param productId: number
     * @returns Promise<ProductRating[]>
     */
    async getProductRatingsByProductId(productId: number): Promise<ProductRating[]> {
        this.logger.debug(
            `getProductRatingsByProductId: Getting a set of product ratings by its productId [productId=${productId}]`,
            {
                context: ProductRatingsService.name,
            },
        );

        return await this.productRatingRepository.find({
            relations: ['user'],
            where: { product: productId },
        });
    }

    async getProductRatingByUserIdAndProductId(userId: number, productId: number): Promise<ProductRating> {
        this.logger.debug(
            `getProductRatingByUserIdAndProductId: Getting a product rating by its userId and productId [userId=${userId}|productId=${productId}]`,
            {
                context: ProductRatingsService.name,
            },
        );

        return await this.productRatingRepository.findOne({
            where: { user: userId, product: productId },
        });
    }
}
