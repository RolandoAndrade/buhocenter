import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ProductInventory } from '../entities/product-inventory.entity';

@Injectable()
export class ProductInventoriesService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
        @InjectRepository(ProductInventory)
        private readonly _productInventoryRepository: Repository<ProductInventory>,
    ) {}

    /**
     * getProductInventoryByCartId
     * @param cartId: number
     * @retuns Promise<ProductInventory>
     */
    async getProductInventoryByCartId(cartId: number): Promise<ProductInventory> {
        this._logger.debug(
            `getProductInventoryByCartId: Getting a Product Inventory by cart id [cartId=${cartId}]`,
            {
                context: ProductInventoriesService.name,
            },
        );

        return await this._productInventoryRepository
            .createQueryBuilder('productInventory')
            .innerJoin('productInventory.product', 'product')
            .innerJoin('product.carts', 'carts')
            .where('carts.id = :cartId', { cartId: cartId })
            .getOne();
    }

    /**
     * updateProductInventoryQuantity
     * @param productInventory: ProductInventory
     * @param quantity: number
     * @param transactionEntityManager: EntityManager
     * @returns void
     */
    async updateProductInventoryQuantity(
        productInventory: ProductInventory,
        quantity: number,
        transactionEntityManager: EntityManager,
    ) {
        this._logger.debug(
            `updateProductInventoryQuantity: Updating Product Inventory quantity [productInventoryId=${productInventory.id}|quantity=${quantity}]`,
            {
                context: ProductInventoriesService.name,
            },
        );

        if (productInventory.availableQuantity - quantity >= productInventory.minimumAvailableQuantity) {
            const productInventoryTransactionRepository: Repository<ProductInventory> = transactionEntityManager.getRepository(
                ProductInventory,
            );
            productInventory.availableQuantity -= quantity;
            await productInventoryTransactionRepository.save(productInventory);
        } else {
            throw new BadRequestException(
                'The payment cannot be processed due the quantity of products \
                on the cart is much bigger than the available quantity',
            );
        }
    }
}
