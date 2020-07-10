import { createQueryBuilder, Repository, UpdateResult, EntityManager, getManager } from 'typeorm';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { Cart } from '../entities/cart.entity';
import { User } from '../../users/entities/user.entity';
import { CartProductDTO } from '../dto/cartProduct.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { STATUS } from '../../../config/constants';
import { ProductsService } from '../../products/services/products.service';
import { UsersService } from '../../users/services/users.service';
import { StatusService } from '../../status/services/status.service';
import { Offer } from '../../products/entities/offer.entity';
import { Status } from '../../status/entities/status.entity';
import { ProductInventoriesService } from 'src/modules/products/services/product-inventories.service';

@Injectable()
export class CartsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
        @InjectRepository(Cart)
        private readonly _cartRepository: Repository<Cart>,
        private readonly ProductsService: ProductsService,
        private readonly UsersService: UsersService,
        private readonly _productInventoryService: ProductInventoriesService,
        private readonly _statusService: StatusService,
    ) {}

    /**
     * Update the given cart with the status
     * @param cartId cart id to update
     * @param statusId status id which will be set to the provided cart
     */
    public async updateCartStatus(cartId: number, statusId: number): Promise<UpdateResult> {
        this._logger.debug(`updateCartStatus: updating cart status [cartId=${cartId}|statusId=${statusId}]`, {
            context: CartsService.name,
        });

        return this._cartRepository.update({ id: cartId }, { status: { id: statusId } });
    }

    /**
     * Finds the products inside the users Carts
     * @param serId cart id to update
     * @return Promise<Carts[]>
     */
    public async findCartUser(userId: number): Promise<Cart[]> {
        this._logger.debug(`findCartUser: [UserId = ${userId}]`, {
            context: CartsService.name,
        });

        const thisUser = await this.UsersService.getUserById(userId);

        const active = await this._statusService.getStatusById(STATUS.ACTIVE.id);

        return await this._cartRepository.find({
            where: { User: thisUser, status: active },
        });
    }

    /**
     * Associate a product and a cart by finding the products and User,and save it in the DB.
     * @params ProductRes, contains the details of the product wich will be associate to the User cart
     * @returns Promise<string>
     */
    public async asociateProductCart(ProductRes: CartProductDTO): Promise<string> {
        this._logger.debug(
            `asociateProductCart: saving product in costumer cart [productRes=${JSON.stringify(ProductRes)}]`,
            { context: CartsService.name },
        );
        try {
            const user: User = await this.UsersService.getUserById(ProductRes.user.id);
            const findProduct: Product = await this.ProductsService.findProduct(ProductRes.product.id);

            const newProductCart: Cart = new Cart();
            const active = await this._statusService.getStatusById(STATUS.ACTIVE.id);
            const productQuantity: number = parseInt(ProductRes.quantity);
            newProductCart.quantity = productQuantity;
            newProductCart.productPrice = findProduct.price;
            newProductCart.user = user;
            newProductCart.status = active;
            newProductCart.product = findProduct;
            const productOffer: Offer = await this.ProductsService.findOffer(findProduct.offer);
            if (Offer) {
                newProductCart.productPrice =
                    newProductCart.productPrice -
                    (newProductCart.productPrice * productOffer.percentage) / 100;

                newProductCart.offerPrice = productOffer.percentage;
            } else {
                newProductCart.offerPrice = 0;
            }
            await this._cartRepository.save(newProductCart);
            this._logger.debug(`createProductCart: product associate to users cart`, {
                context: CartsService.name,
            });

            return 'product associated succesfully';
        } catch (e) {
            this._logger.error(
                `createProductCart: error when trying to product associate to users cart([error= ${JSON.stringify(
                    e.message,
                )}])`,
                { context: CartsService.name },
            );
            throw new BadRequestException('Error saving product in the users cart');
        }
    }

    /**
     * Returns the products with its saved items
     * @param userId current logged in User id
     * @return Promise<Cart[]>
     */
    async findCartProduct(userId: number): Promise<Cart[]> {
        this._logger.debug(`findCartProduct: [userId=${userId}]`, {
            context: CartsService.name,
        });

        let cart: Cart[] = await this._cartRepository
            .createQueryBuilder('cart')
            .innerJoinAndSelect('cart.status', 'status')
            .innerJoinAndSelect('cart.product', 'product')
            .innerJoinAndSelect('product.brand', 'brand')
            .innerJoinAndSelect('product.provider', 'provider')
            .innerJoinAndSelect('product.productPhotos', 'productPhotos')
            .innerJoinAndSelect('product.productDimension', 'productDimension')
            .innerJoinAndSelect('product.productInventory', 'productInventory')
            .leftJoinAndSelect('product.offer', 'offer')
            .where('cart.user = :userId', { userId: userId })
            .andWhere('cart.status = :statusId', { statusId: STATUS.ACTIVE.id })
            .getMany();

        return cart;
    }

    async dropProductCart(productCartId: number): Promise<boolean> {
        this._logger.debug(`deleteProductCart: deleting productCart by id [id=${productCartId}]`, {
            context: CartsService.name,
        });
        const productCartResponse = await this._cartRepository.delete(productCartId);
        return !!productCartResponse;
    }

    cleanStatusOfferProducts(productsCart: any): any {
        this._logger.debug(`cleanStatusOfferProducts: [productsCart=${JSON.stringify(productsCart)}]`, {
            context: CartsService.name,
        });

        const cleanProductsCartOffer: any[] = [];
        productsCart.map((productCart, index) => {
            const product = productCart.product;
            // tslint:disable-next-line:no-shadowed-variable
            const offer = product.offers.find(offer => offer.id === STATUS.ACTIVE.id);
            delete product.offers;
            if (offer) {
                product.offer = offer;
            } else {
                product.offer = false;
            }
            productCart.product = product;
            cleanProductsCartOffer.push(productCart);
        });

        return cleanProductsCartOffer;
    }

    /**
     * reserveCarts
     * @param carts: Carts[]
     * @param transactionEntityManager: EntityManager
     * @returns void
     */
    async reserveCarts(carts: Cart[], transactionEntityManager: EntityManager) {
        this._logger.debug(`reserveCarts: Reserving a set of carts due a new payment`, {
            context: CartsService.name,
        });

        const reservedStatus = await this._statusService.getStatusById(STATUS.RESERVED.id);

        carts.forEach(cart => {
            cart.status = reservedStatus;
        });

        for await (const cart of carts) {
            const productInventory = await this._productInventoryService.getProductInventoryByCartId(cart.id);
            await this._productInventoryService.updateProductInventoryQuantity(
                productInventory,
                cart.quantity,
                transactionEntityManager,
            );
        }

        const cartTransactionRepository: Repository<Cart> = transactionEntityManager.getRepository(Cart);
        await cartTransactionRepository.save(carts);
    }

    /**
     * giveBackCarts
     * @param carts: Carts[]
     * @returns void
     */
    async giveBackCarts(carts: Cart[]) {
        this._logger.debug(`giveBackCarts: give back a set of carts due a invalid payment`, {
            context: CartsService.name,
        });

        const activeStatus = await this._statusService.getStatusById(STATUS.ACTIVE.id);

        carts.forEach(cart => {
            cart.status = activeStatus;
        });

        await getManager().transaction(async transactionEntityManager => {
            try {
                for await (const cart of carts) {
                    const productInventory = await this._productInventoryService.getProductInventoryByCartId(
                        cart.id,
                    );
                    await this._productInventoryService.updateProductInventoryQuantity(
                        productInventory,
                        -cart.quantity,
                        transactionEntityManager,
                    );
                }

                const cartTransactionRepository: Repository<Cart> = transactionEntityManager.getRepository(
                    Cart,
                );
                await cartTransactionRepository.save(carts);
            } catch (error) {
                throw error;
            }
        });
    }

    /**
     * payCarts
     * @param carts: Cart[]
     * @param paidStatus: Status
     * @returns void
     */
    async payCarts(carts: Cart[], paidStatus: Status) {
        this._logger.debug(`payCarts: paying a set of carts due a paid payment`, {
            context: CartsService.name,
        });

        carts.forEach(cart => {
            cart.status = paidStatus;
        });

        await this._cartRepository.save(carts);
    }

    /**
     * getPriceForCarts
     * @param carts: Cart[]
     * @returns number
     */
    getPriceForCarts(carts: Cart[]): number {
        this._logger.debug(`getPriceForCarts: Getting a price for a set of carts`, {
            context: CartsService.name,
        });

        let price = 0;
        carts.forEach(cart => {
            price += cart.quantity * cart.productPrice;
        });

        return price;
    }
}
