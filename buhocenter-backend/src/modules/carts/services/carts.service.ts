import { createQueryBuilder, Repository, UpdateResult, EntityManager} from 'typeorm';
import { Injectable, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { Cart } from '../entities/cart.entity';
import { ProductCart } from '../entities/product-cart.entity';
import { Customer } from '../../users/entities/customer.entity';
import { CartProductDTO } from '../dto/cartProduct.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { STATUS } from '../../../config/constants';
import { ProductsService } from '../../products/services/products.service';
import { UsersService } from '../../users/services/Users.service';
import { StatusService } from '../../status/services/status.service';
import { CartServiceDTO } from '../dto/cartService.dto';
import { ServiceCart } from '../entities/service-cart.entity';
import { ServicesService } from '../../services/services/services.service';
import { Service } from '../../services/entities/service.entity';
import { Status } from '../../Status/entities/status.entity';

@Injectable()
export class CartsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(ProductCart)
        private readonly productCartRepository: Repository<ProductCart>,
        @InjectRepository(ServiceCart)
        private serviceCartRepository: Repository<ServiceCart>,
        @Inject(ProductsService)
        private readonly ProductsService: ProductsService,
        @Inject(UsersService)
        private readonly UsersService: UsersService,
        @Inject(StatusService)
        private readonly StatusService: StatusService,
        @Inject(ServicesService)
        private readonly ServicesService: ServicesService,
    ) {}

    /**
     * Update the given cart with the status
     * @param cartId cart id to update
     * @param statusId status id which will be set to the provided cart
     * @param transactionalEntityManager transactional entity manager
     */
    public async updateCartStatus(
        cartId: number, statusId: number, transactionalEntityManager: EntityManager,
    ): Promise<UpdateResult> {
        this.logger.debug(`updateCartStatus: updating cart status [cartId=${cartId}|statusId=${statusId}]`,
            { context: CartsService.name });

        const cartTransactionRepository: Repository<Cart> = transactionalEntityManager.getRepository(
            Cart,
        );
        
        return cartTransactionRepository.update({ id: cartId }, { status: { id: statusId }});
    }

    public async findCartUser(customerId: number): Promise<Cart> {
        this.logger.debug(`findCartUser: [customerId = ${customerId}]`, { context: CartsService.name });
        let thisCustomer = await this.UsersService.findUser(customerId);
        let active = await this.StatusService.getStatus(STATUS.ACTIVE.id);
        return await this.cartRepository.findOne({
            where:{customer:thisCustomer, status:active}
        });
    }

	private async createCart(findCustomer: Customer): Promise<Cart> {
        await this.logger.debug(`createCart: creando cart [findCustomer=${JSON.stringify(findCustomer)}`,
            { context: CartsService.name });
        const active = await this.StatusService.getStatus(STATUS.ACTIVE.id);
        const newCart = new Cart();
        newCart.customer = findCustomer;
        newCart.status = active;
        await this.cartRepository.save(newCart);
        await this.logger.debug(`createCart: cart creado [findCustomer = ${JSON.stringify(findCustomer)}`,
            { context: CartsService.name });
        return newCart;
	}

    private async createProductCart(cart: Cart, product: Product, quantity: number) {
        const newProductCart: ProductCart = new ProductCart();
        newProductCart.quantity = quantity;
        newProductCart.cart = cart;
        newProductCart.product = product;
        await this.productCartRepository.save(newProductCart);
        this.logger.debug(`createProductCart: relacion product cart guardada([cart = ${JSON.stringify(cart)}|product = ${JSON.stringify(product)}|quantity = ${quantity}])`,
            { context: CartsService.name });
    }

    /**
    * Associate a product and a cart
    * @params ProductRes, contains the details of the product wich will be associate to the customer cart
    * @returns Promise<Cart>
    */
    public async asociateProductCart(ProductRes: CartProductDTO): Promise<Cart> {
        this.logger.debug(`asociateProductCart: associating product and cart [productRes=${JSON.stringify(ProductRes)}]`,
            { context: CartsService.name });

        const findCustomer: Customer = await this.UsersService.findUser(ProductRes.customer.id);
        const findProduct: Product = await this.ProductsService.findProduct(ProductRes.product.id);
        const findCartNewest: Cart = await this.findCartUser(ProductRes.customer.id);

        if (findCartNewest) {
            this.logger.debug(`asociateProductCart: cart found!`, { context: CartsService.name });
            await this.createProductCart(findCartNewest, findProduct, ProductRes.quantity);
            return findCartNewest;
        } else {
            this.logger.debug(`asociateProductCart: no carts found!`, { context: CartsService.name });
            const newCart: Cart = await this.createCart(findCustomer);
            await this.createProductCart(newCart, findProduct, ProductRes.quantity);
            return newCart;
        }
   }

    private async createServiceCart(CustomerCart: Cart, Service, quantity: number) {
        const newServiceCart: ServiceCart = new ServiceCart();
        newServiceCart.quantity = quantity;
        newServiceCart.cart = CustomerCart;
        newServiceCart.service = Service;
        await this.serviceCartRepository.save(newServiceCart);
    }

    async asociateServiceCart(ServiceRes: CartServiceDTO): Promise<string> {
        this.logger.debug(`asociateServiceCart: [serviceRes=${JSON.stringify(ServiceRes)}]`,
            {context: CartsService.name});

        const findCustomer: Customer = await this.UsersService.findUser(ServiceRes.customer.id);
        const findService: Service = await this.ServicesService.findService(ServiceRes.service.id);
        const findCartNewest: Cart = await this.findCartUser(ServiceRes.customer.id);

        if (findCartNewest) {
            await this.createServiceCart(findCartNewest, findService, ServiceRes.quantity);
        } else {
            const newCart: Cart = await this.createCart(findCustomer);
            await this.createServiceCart(newCart, findService,
                ServiceRes.quantity);
        }

        this.logger.debug(`asociateServiceCart: [serviceRes=${JSON.stringify(ServiceRes)}]`,
            {context: CartsService.name});

        return 'Service added to cart successfully!';
    }

    /**
     * Returns the products with its saved items
     * @param customerId current logged in customer id
     */
    async findCartProduct(customerId: number): Promise<any> {
        this.logger.debug(`findCartProduct: [customerId=${customerId}]`, { context: CartsService.name });

        const cart = await this.cartRepository.findOne({
            where: `customer_id = ${customerId}`,
            relations: [
                'productCarts',
                'productCarts.checkout',
                'productCarts.product',
                'productCarts.product.status',
                'productCarts.product.photos',
                'productCarts.product.productProvider',
                'productCarts.product.productProvider.provider',
                'productCarts.product.offers',
                'productCarts.product.offers.offer',
            ],
        });
        cart.productCarts = await this.cleanStatusOfferProducts(cart.productCarts);
        cart.productCarts = cart.productCarts.filter((i) => 
            !i.checkout && i.product && i.product.status && i.product.status.id !== STATUS.INACTIVE.id
        );
        return cart;
    }

    /**
     * 
     * @param cartId 
     * @param productId 
     * @param checkoutId 
     * @param transactionalEntityManager 
     */
    async updateProductCartCheckout(cartId: number, productId: number, checkoutId: number, transactionalEntityManager: EntityManager): Promise<UpdateResult> {
        this.logger.debug(`updateProductCartCheckout: [cartId=${cartId}|productId=${productId}|checkoutId=${checkoutId}]`, { context: CartsService.name });

        const productCartTransactionRepository: Repository<ProductCart> = transactionalEntityManager.getRepository(
            ProductCart,
        );

        return productCartTransactionRepository.query(
            `UPDATE cart_product SET checkout_id = ${checkoutId} WHERE cart_id = ${cartId} AND product_id = ${productId}`
        );
    }

    /**
     * This method sets new property on productCart items to notify
     * which one has an offer available
     * @param productsCart productCarts items
     */
    cleanStatusOfferProducts(productsCart: any): any {
        this.logger.debug(`cleanStatusOfferProducts: [productsCart=${JSON.stringify(productsCart)}]`, { context: ServiceCart.name });

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

    async dropProductCart(productCartId: number): Promise<boolean> {
        this.logger.debug(`deleteProductCart: deleting productCart by id [id=${productCartId}]`, { context: ServiceCart.name });
        const productCartResponse = await this.productCartRepository.delete(productCartId);
        return !!productCartResponse;
    }

}
