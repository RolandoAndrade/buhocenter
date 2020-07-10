import { Repository, EntityManager, SelectQueryBuilder } from 'typeorm';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { STATUS } from '../../../config/constants';
import { idDto } from '../dto/products.dto';
import { Product } from '../entities/product.entity';
import { ProductRating } from '../entities/product-rating.entity';
import { ProductInventory } from '../entities/product-inventory.entity';
import { ProductDimension } from '../entities/product-dimension.entity';
import { StatusService } from '../../status/services/status.service';
import { BrandsService } from '../services/brands.service';
import { CategoriesService } from '../services/categories.service';
import { ProductPhoto } from '../entities/product-photo.entity';
import { Offer } from '../entities/offer.entity';
import { ProductParameters } from '../interfaces/product-parameters';
import { PaginatedProducts } from '../interfaces/paginated-products';
import { PAGINATE } from '../../../config/constants';
import { ProductQuestion } from '../entities/product-question.entity';
import { UsersService } from '../../users/services/users.service';
import { ProductQuestions } from '../interfaces/product-questions';
import { CustomerLoyaltyService } from '../../third-party/services/customer-loyalty.service';

@Injectable()
export class ProductsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(ProductRating)
        private readonly productRatingsRepository: Repository<ProductRating>,
        @InjectRepository(ProductInventory)
        private readonly productInventoriesRepository: Repository<ProductInventory>,
        @InjectRepository(ProductDimension)
        private readonly productDimensionRepository: Repository<ProductDimension>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @Inject(StatusService)
        private readonly statusService: StatusService,
        @Inject(BrandsService)
        private readonly brandsService: BrandsService,
        @Inject(CategoriesService)
        private readonly categoriesService: CategoriesService,
        @InjectRepository(ProductPhoto)
        private readonly productPhotoRepository: Repository<ProductPhoto>,
        @InjectRepository(ProductQuestion)
        private readonly productQuestionRepository: Repository<ProductQuestion>,
        @Inject(UsersService)
        private readonly usersService: UsersService,
        private readonly customerLoyaltyService: CustomerLoyaltyService,
    ) {}

    /**
     * createProduct
     * @param product: Partial<Product>
     * @returns Promise<Product>
     */
    async createProduct(product: Partial<Product>): Promise<Product> {
        this.logger.debug(`createProduct: Creating a product [productName=${product.name}]`, {
            context: ProductsService.name,
        });

        return await this.productsRepository.save(product);
    }

    /**
     * Returns the appreciations emitted to a product array
     * @param products products array to obtain its appreciations
     */
    private async getProductAverageRating(products: Product[]): Promise<void> {
        for await (const product of products) {
            product.productRatings = await this.productRatingsRepository.query(
                `SELECT ROUND(AVG(CP.rating)) as rating, COUNT(*) as total
                    FROM product_ratings CP
                    WHERE CP.product_id = ${product.id}
                `.trim(),
            );

            this.logger.debug(
                `getProductAverageRating [id=${product.id}|productRatings=${JSON.stringify(
                    product.productRatings,
                )}]`,
            );
        }
    }

    /**
     * Returns the quantity available in inventory according to a product
     * @param productId product id to obtain the inventory availability
     * @returns Promise<ProductInventory>
     */
    public async getProductInventoryAvailability(productId: number): Promise<ProductInventory> {
        this.logger.debug(`getProductInventoryAvailability: [productId=${productId}]`, {
            context: ProductsService.name,
        });

        return this.productInventoriesRepository.findOne(productId);
    }

    /**
     * Creates a new entity in the product inventory
     * @param productInventory productInventory entity to save in database
     * @param transactionalEntityManager
     */
    public async updateProductInventory(
        productInventory,
        transactionalEntityManager: EntityManager,
    ): Promise<any> {
        this.logger.debug(`updateProductInventory: [productInventory=${JSON.stringify(productInventory)}]`, {
            context: ProductsService.name,
        });

        const productInventoryTransactionRepository: Repository<ProductInventory> = transactionalEntityManager.getRepository(
            ProductInventory,
        );

        return productInventoryTransactionRepository.save(productInventory);
    }

    /**
     * Returns the product by id
     * @param id product id
     */
    public async getProductById(id: number): Promise<Product> {
        this.logger.debug(`getProductById: [id=${id}]`, {
            context: ProductsService.name,
        });

        return await this.productsRepository.findOne({
            where: { id },
            relations: [
                'status',
                'productPhotos',
                'productInventory',
                'provider',
                'productDimension',
                'brand',
                'offer',
                'productRatings',
            ],
        });
    }

    /**
     * getProducts
     * @param parameters: ProductParameters
     * @returns Promise<PaginatedProducts>
     */
    async getProducts(parameters: ProductParameters): Promise<PaginatedProducts> {
        this.logger.debug(
            `getProducts:  Getting products by a set of parameters [parameters:${JSON.stringify(
                parameters,
            )}]`,
            {
                context: ProductsService.name,
            },
        );

        parameters.start = parameters.start || PAGINATE.START;
        parameters.limit = parameters.limit || PAGINATE.LIMIT;

        parameters.start = parameters.start * parameters.limit - parameters.limit;
        let query: SelectQueryBuilder<Product> = this.productsRepository
            .createQueryBuilder('product')
            .innerJoinAndSelect('product.status', 'status')
            .innerJoinAndSelect('product.productPhotos', 'productPhotos')
            .innerJoinAndSelect('product.brand', 'brand')
            .innerJoinAndSelect('product.provider', 'provider')
            .innerJoinAndSelect('product.productInventory', 'productInventory')
            .innerJoinAndSelect('product.productCatalogues', 'productCatalogues')
            .innerJoinAndSelect('productCatalogues.catalogue', 'catalogue')
            .innerJoinAndSelect('product.productDimension', 'dimesion')
            .innerJoinAndSelect('catalogue.category', 'category')
            .leftJoinAndSelect('product.offer', 'offer');

        !parameters.name ||
            query.andWhere('UPPER(product.name) LIKE :name', { name: `%${parameters.name.toUpperCase()}%` });
        !parameters.rating ||
            query.andWhere('FLOOR(product.rating) = :rating', { rating: parameters.rating });
        !parameters.price || query.andWhere('product.price <= :price', { price: parameters.price });
        !parameters.brandId || query.andWhere('brand.id = :brandId ', { brandId: parameters.brandId });
        !parameters.providerId ||
            query.andWhere('provider.id = :providerId ', { providerId: parameters.providerId });
        !parameters.offerId || query.andWhere('offer.id = :offerId ', { offerId: parameters.offerId });
        !parameters.catalogueId ||
            query.andWhere('catalogue.id = :catalogueId', { catalogueId: parameters.catalogueId });
        !parameters.categoryId ||
            query.andWhere('category.id = :categoryId', { categoryId: parameters.categoryId });
        query.andWhere('productInventory.availableQuantity - productInventory.minimumAvailableQuantity > 0');
        query.andWhere('status.id = :statusId', { statusId: STATUS.ACTIVE.id });

        const products: Product[] = await query
            .skip(parameters.start)
            .take(parameters.limit)
            .getMany();

        return {
            products,
            productsNumber: await query.getCount(),
        };
    }

    async findProduct(ProductID: number): Promise<Product> {
        return await this.productsRepository.findOne(ProductID);
    }

    /**
     * Obtiene el listado de products recomendados del dia
     */
    public async getDailyProductsRecommendation(): Promise<Product[]> {
        this.logger.debug(`getDailyProductsRecommendation: ejecutando query`, {
            context: ProductsService.name,
        });
        let products: Product[] = await this.productsRepository.find({
            where: `products.status_id = ${STATUS.ACTIVE.id}`,
            join: {
                alias: 'products',
                innerJoinAndSelect: {
                    photos: 'products.productPhotos',
                    productProvider: 'products.provider',
                    provider: 'products.provider',
                    catalogues: 'products.productCatalogues',
                    catalogue: 'catalogues.catalogue',
                    category: 'catalogue.category',

                    status: 'products.status',
                },
            },
        });
        await this.getProductAverageRating(products);
        products = this.randomProducts(products);
        return products;
    }

    randomProducts(products: Product[]): Product[] {
        const randomProducts = products.sort((a, b) => Math.random() - 0.5);
        return [...randomProducts].slice(0, 5);
    }

    async updateUsersProduct(productId: number, updatedProduct) {
        let active = STATUS.ACTIVE.id;
        let verifyProduct = await this.productsRepository.findOne({
            where: { id: productId, status: active },
        });

        let maybeProviderArray, maybeCategoryArray;

        if (!verifyProduct) {
            throw new BadRequestException('that Product is not accesable for the system');
        } else {
            this.logger.debug(`updateUsersProduct: [id=${JSON.stringify(updatedProduct)}]`, {
                context: ProductsService.name,
            });

            let keys = Object.entries(updatedProduct);
            for (var i = 0; i < keys.length; i++) {
                switch (keys[i][0]) {
                    case 'productName':
                        if ((keys[i][1] as string) == '') {
                            this.logger.info(`updateUsersProduct: name not declare, not updating name..`, {
                                context: ProductsService.name,
                            });
                        } else {
                            verifyProduct.name = keys[i][1] as string;
                        }

                        break;

                    case 'description':
                        if ((keys[i][1] as string) == '') {
                            this.logger.info(
                                `updateUsersProduct: description not declare, not updating description..`,
                                { context: ProductsService.name },
                            );
                        } else {
                            verifyProduct.description = keys[i][1] as string;
                        }

                        break;

                    case 'price':
                        if ((keys[i][1] as number) == 0) {
                            this.logger.info(`updateUsersProduct: price not declare, not updating price..`, {
                                context: ProductsService.name,
                            });
                        } else {
                            verifyProduct.price = keys[i][1] as number;
                        }
                        break;

                    case 'category':
                        let maybeCategory: idDto = keys[i][1] as idDto;
                        if ((maybeCategory.id as number) == 0) {
                            this.logger.info(
                                `updateUsersProduct: category not declare, not updating category..`,
                                { context: ProductsService.name },
                            );
                        } else {
                            let maybeCategoryArray: number = keys[i][1] as number;
                            await this.categoriesService.createCategoryProduct(
                                maybeCategoryArray,
                                verifyProduct,
                            );
                        }

                        break;

                    case 'brand':
                        if ((keys[i][1] as number) == 0) {
                            this.logger.info(`updateUsersProduct: brand not declare, not updating brand...`, {
                                context: ProductsService.name,
                            });
                        } else {
                            verifyProduct.brand = await this.brandsService.getBrand(keys[i][1] as number);
                        }

                        break;
                }
            }
        }

        await this.productsRepository.save(verifyProduct);
        this.logger.info(
            `updateUsersProduct: product updated and save succesfully [verifyProduct=${JSON.stringify(
                verifyProduct,
            )}]`,
            { context: ProductsService.name },
        );

        return 'product updated succesfully';
    }

    async updateProduct(product: Partial<Product>): Promise<Product> {
        this.logger.info(`updateProduct: Updating the product [productId=${product.id}]`, {
            context: ProductsService.name,
        });

        return await this.productsRepository.save(product);
    }

    /**
     * deleteProduct
     * @param productId: number
     * @returns
     */
    async deleteProduct(productId: number): Promise<Boolean> {
        this.logger.info(`deleteProduct: Deleting the product with id [productId=${productId}]`, {
            context: ProductsService.name,
        });

        let product = await this.productsRepository.findOne({
            where: { id: productId, status: STATUS.ACTIVE.id },
        });

        if (!product) {
            throw new BadRequestException('Product not found or not accesable');
        } else {
            const inactive = await this.statusService.getStatusById(STATUS.INACTIVE.id);
            product.status = inactive;

            await this.productsRepository.save(product);
            return true;
        }
    }

    /**
     * getAllProducts
     * @returns Promise<Product[]>
     */
    public async getAllProducts(): Promise<Product[]> {
        this.logger.info(`getAllProducts: Getting all products`, {
            context: ProductsService.name,
        });

        return await this.productsRepository.find({
            relations: [
                'productPhotos',
                'productInventory',
                'productDimension',
                'productRatings',
                'brand',
                'provider',
                'offer',
                'productCatalogues',
                'productCatalogues.catalogue',
                'productCatalogues.catalogue.category',
            ],
        });
    }

    public async deletMultiplesProducts(productsArray: number[]): Promise<string> {
        const status = Promise.all(
            productsArray.map(async value => {
                await this.deleteProduct(value);
            }),
        );

        return 'products deleted sucesfully';
    }

    async createDimension(
        newWidth: string,
        newHeight: string,
        newLong: string,
        verifiedProduct: number,
    ): Promise<any> {
        let newDimension = new ProductDimension();
        let foundProduct = await this.productsRepository.findOne(verifiedProduct);
        newDimension.width = newWidth;
        newDimension.height = newHeight;
        newDimension.long = newLong;
        newDimension.product = foundProduct;
        await this.productDimensionRepository.save(newDimension);

        return true;
    }

    async saveProductImage(imageName: string, productId: number): Promise<string> {
        let imageProduct: Product = await this.productsRepository.findOne(productId);
        let newProductPhoto = new ProductPhoto();
        newProductPhoto.product = imageProduct;
        newProductPhoto.content = imageName;
        await this.productPhotoRepository.save(newProductPhoto);
        return 'product associate with image!';
    }

    public async saveInventory(quantity, productId): Promise<string> {
        let newProductInventory = new ProductInventory();
        let foundProduct = await this.productsRepository.findOne(productId);
        newProductInventory.product = foundProduct;
        newProductInventory.availableQuantity = quantity;
        await this.productInventoriesRepository.save(newProductInventory);
        return 'inventorio guardado';
    }

    public async updateInventory(quantity: number, productId: number): Promise<string> {
        let foundProduct = await this.productsRepository.findOne(productId);
        let foundInventory = await this.productInventoriesRepository.findOne({
            where: { product: foundProduct },
        });
        foundInventory.availableQuantity = quantity;

        await this.productInventoriesRepository.save(foundInventory);
        return 'inventario actualizado exitosamente';
    }

    public async findOffer(offer: Offer): Promise<Offer> {
        return await this.offerRepository.findOne(offer);
    }

    public async assignOffer(
        productId: number,
        offerId: number,
        transactionalEntityManager: EntityManager,
    ): Promise<boolean> {
        try {
            let ProductRepository: Repository<Product> = await transactionalEntityManager.getRepository(
                Product,
            );
            await ProductRepository.update({ id: productId }, { offer: { id: offerId } });

            return true;
        } catch (e) {
            this.logger.error(
                `assignOffer: error when trying to assign the offer to product [offerId=${offerId}| productId=${productId}|error=${JSON.stringify(
                    e.message,
                )}]`,
            );

            return false;
        }
    }

    public async deleteOffer(productId: number, transactionalEntityManager: EntityManager): Promise<boolean> {
        try {
            let ProductRepository: Repository<Product> = await transactionalEntityManager.getRepository(
                Product,
            );
            await ProductRepository.update({ id: productId }, { offer: null });

            return true;
        } catch (e) {
            this.logger.error(
                `assignOffer: error when trying to delete the offer to product [productId=${productId}|error=${JSON.stringify(
                    e.message,
                )}]`,
            );

            return false;
        }
    }

    /**
     * updateProductRating
     * @param product: Partial<Product>
     * @param transactionEntityManager: EntityManager
     * @returns void
     */
    async updateProductRating(product: Partial<Product>, transactionEntityManager: EntityManager) {
        this.logger.debug(`updateProductRating: Updating the rating of a product [productId=${product.id}]`, {
            context: ProductsService.name,
        });

        const productTransactionRepository: Repository<Product> = transactionEntityManager.getRepository(
            Product,
        );

        const { avgRating } = await productTransactionRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.productRatings', 'productRatings')
            .select('AVG(productRatings.rating)', 'avgRating')
            .where('product.id = :productId', { productId: product.id })
            .getRawOne();

        await productTransactionRepository.update({ id: product.id }, { rating: avgRating });
    }

    public async addQuestionToProduct(productAndQuestion: ProductQuestions): Promise<boolean> {
        try {
            let newProductQuestion = new ProductQuestion();
            newProductQuestion.comment = productAndQuestion.comment;
            newProductQuestion.product = await this.findProduct(productAndQuestion.product.id);
            newProductQuestion.user = await this.usersService.getUserById(productAndQuestion.user.id);

            await this.productQuestionRepository.save(newProductQuestion);

            return true;
        } catch (e) {
            this.logger.error(
                `addQuestionToProduct: error when trying to save the comment to product [productAndQuestion=${JSON.stringify(
                    productAndQuestion,
                )}|error=${JSON.stringify(e.message)}]`,
                {
                    context: ProductsService.name,
                },
            );

            throw new BadRequestException('error when trying to to save the comment to product');
            return false;
        }
    }

    public async deleteQuestionInProduct(questionId: number): Promise<boolean> {
        try {
            await this.productQuestionRepository.delete({
                id: questionId,
            });

            return true;
        } catch (e) {
            this.logger.error(
                `deleteQuestionInProduct: error when trying to delete the comment in the product [questionId=${questionId}|error=${JSON.stringify(
                    e.message,
                )}]`,
            );

            throw new BadRequestException('error when trying to delete the comment in the product');
            return false;
        }
    }

    public async getAllQuestionsInProduct(productId: number): Promise<any> {
        try {
            let foundProduct = await this.findProduct(productId);
            return await this.productQuestionRepository.find({
                where: { product: foundProduct },
                join: {
                    alias: 'productsQuestions',
                    innerJoinAndSelect: {
                        user: 'productsQuestions.user',
                    },
                },
            });
        } catch (e) {
            this.logger.error(
                `getAllQuestionsInProduct: error when trying to get all comments in the product [productId=${productId}|error=${JSON.stringify(
                    e.message,
                )}]`,
            );

            throw new BadRequestException('error when trying to get all comments in the product');
            return false;
        }
    }

    /**
     * create the pdf of an specific order
     * @param paymentId id of the order
     * @returns Promise<any>
     */
    public async createPdf(paymentId: number): Promise<any> {
        const path = require('path');
        this.logger.debug(`sendPdf: creating pdf of order... [order=${paymentId}]`, {
            context: ProductsService.name,
        });

        try {
            let pdfClienteData = await this.getPdfClientData(paymentId);
            let pdfCartData = await this.getPdfCartData(paymentId);

            let today = new Date();
            let currentTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

            // Define font files
            var fonts = {
                Roboto: {
                    normal: path.resolve(__dirname, '../../../../reports', 'fonts', 'Roboto-Light.ttf'),
                    bold: path.resolve(__dirname, '../../../../reports', 'fonts', 'Roboto-Medium.ttf'),
                    italics: path.resolve(__dirname, '../../../../reports', 'fonts', 'Roboto-Italic.ttf'),
                    bolditalics: path.resolve(
                        __dirname,
                        '../../../../reports',
                        'fonts',
                        'Roboto-MediumItalic.ttf',
                    ),
                },
            };

            var PdfPrinter = require('pdfmake');
            var printer = new PdfPrinter(fonts);
            var fs = require('fs');
            //let buhocenterLogo = await this.convertImageToDataURL(path.resolve(__dirname,'../../../../pdf','assets','Logo-completo.png'),100);

            var docDefinition = {
                content: [
                    {},
                    {
                        style: 'footer',
                        table: {
                            headerRows: 1,
                            widths: [200, 100, 200],
                            heights: [10, 10, 10],
                            body: [
                                ['', { text: 'Buhocenter', style: 'tableHeader', alignment: 'center' }, ''],
                                ['', {}, ''],
                            ],
                        },
                        layout: 'headerLineOnly',
                    },
                    {
                        style: 'tableExample',
                        color: '#444',
                        table: {
                            widths: ['*', '*'],
                            headerRows: 2,
                            body: [
                                [
                                    { text: `Invoice`, style: 'tableHeader', alignment: 'left', colSpan: 2 },
                                    '',
                                ],
                                [
                                    {
                                        text: `Client ID: ${pdfClienteData[0].id}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                    },
                                    {
                                        text: `Invoice ID: ${pdfCartData[0].id}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                    },
                                ],
                                [
                                    { text: `Date: ${currentTime}`, style: 'tableHeader', alignment: 'left' },
                                    {
                                        text: `Transaction ID: ${pdfClienteData[0].transaction_id}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                    },
                                ],
                            ],
                        },
                        layout: 'noBorders'
                    },
                    {
                        style: 'fisrtTable',
                        color: '#444',
                        table: {
                            widths: ['*', '*'],
                            headerRows: 2,
                            body: [
                                [
                                    {
                                        text: `Client data`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                        colSpan: 2,
                                    },
                                    '',
                                ],
                                [
                                    {
                                        text: `Name: ${pdfClienteData[0].name}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                    },
                                    {
                                        text: `Last name: ${pdfClienteData[0].last_name}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                    },
                                ],
                                [
                                    {
                                        text: `Email: ${pdfClienteData[0].email}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                        colSpan: 2,
                                    },
                                    '',
                                ],
                            ],
                        },
                        layout: 'noBorders'
                    },

                    {
                        style: 'tableExample',
                        color: '#444',
                        table: {
                            widths: ['*', '*'],
                            // keepWithHeaderRows: 1,
                            body: [
                                [
                                    { text: 'Address', style: 'tableHeader' },
                                    { text: `Zip code: ${pdfClienteData[0].zip_code}`, style: 'tableHeader' },
                                ],
                                [
                                    {
                                        text: `First street: ${pdfClienteData[0].first_street}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                    },
                                    {
                                        text: `Second street: ${pdfClienteData[0].second_street}`,
                                        style: 'tableHeader',
                                    },
                                ],
                                [
                                    {
                                        text: `City: ${pdfClienteData[0].city}`,
                                        style: 'tableHeader',
                                        alignment: 'left',
                                    },
                                    { text: `State: ${pdfClienteData[0].state}`, style: 'tableHeader' },
                                ],
                            ],
                        },
                        layout: 'noBorders'
                    },

                    {
                        style: 'tableExample',
                        color: '#444',
                        table: {
                            widths: ['*', 50, 80, 80, 100],
                            headerRows: 2,
                            // keepWithHeaderRows: 1,
                            body: [
                                [
                                    { text: 'Products', style: 'header', colSpan: 5, alignment: 'center' },
                                    {},
                                    {},
                                    '',
                                    {},
                                ],
                                [
                                    { text: 'Name', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Quantity', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Ind. price', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Discount', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Import', style: 'tableHeader', alignment: 'center' },
                                ],
                            ],
                        },
                        layout: 'noBorders'
                    },

                    {
                        style: 'leftTable',
                        color: '#444',
                        alignment: 'center',
                        table: {
                            widths: [100, 100],

                            // keepWithHeaderRows: 1,

                            body: [
                                [
                                    { text: `Tax:`, style: 'tableHeader', alignment: 'left' },
                                    {
                                        text: `${pdfClienteData[0].processor_fee +
                                            pdfClienteData[0].service_fee}`,
                                        style: 'tableHeader',
                                        alignment: 'center',
                                    },
                                ],
                                [
                                    { text: `Total:`, style: 'tableHeader', alignment: 'left' },
                                    {
                                        text: `${pdfClienteData[0].total}`,
                                        style: 'tableHeader',
                                        alignment: 'center',
                                    },
                                ],
                                [
                                    { text: `Total cryp:`, style: 'tableHeader', alignment: 'left' },
                                    {
                                        text: `${pdfClienteData[0].total_cryptocurrency}`,
                                        style: 'tableHeader',
                                        alignment: 'center',
                                    },
                                ],
                            ],
                        },
                        layout: 'noBorders'
                    },
                ],
                styles: {
                    header: {
                        fontSize: 13,
                        bold: true,
                        margin: [0, 0, 0, 5],
                        color: 'black',
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15],
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                    },
                    leftTable: {
                        margin: [298, 5, 0, 15],
                    },

                    defaultStyle: {
                        // alignment: 'justify'
                    },
                    footer: {
                        margin: [0, 0, 0, 15],
                    },

                    fisrtTable: {
                        margin: [0, 30, 0, 15],
                    },
                    sideTable: {
                        margin: [210, -150, 0, 15],
                    },
                },
            };

            pdfCartData.forEach(product =>
                docDefinition.content[5].table.body.push([
                    { text: `${product.name}`, style: 'tableHeader', alignment: 'center' },
                    { text: `${product.quantity}`, style: 'tableHeader', alignment: 'center' },
                    { text: `${product.product_price}`, style: 'tableHeader', alignment: 'center' },
                    { text: `${product.offer_price}`, style: 'tableHeader', alignment: 'center' },
                    {
                        text: `${(product.price * product.quantity).toFixed(2)}`,
                        style: 'tableHeader',
                        alignment: 'center',
                    },
                ]),
            );

            var options = {
                // ...
            };

            fs.mkdirSync('reports/pdfs', { recursive: true });

            var pdfDoc = await printer.createPdfKitDocument(docDefinition, options);
            await pdfDoc.pipe(
                fs.createWriteStream(
                    path.resolve(__dirname + '../../../../../reports/pdfs/' + paymentId + '.pdf'),
                ),
            );
            pdfDoc.end();

            return pdfDoc;
        } catch (e) {
            this.logger.error(
                `sendPdf: error when trying to create the pdf of the order with id[orderId =${paymentId}]|error=${JSON.stringify(
                    e.message,
                )}`,
                {
                    context: ProductsService.name,
                },
            );

            throw new BadRequestException('error when trying to create the pdf of the order...');
        }
    }

    public async getPdfClientData(paymentId: number) {
        return await this.productsRepository.query(
            `SELECT  u.id ,u.name, u.last_name, u.email, ad.first_street, ad.second_street, ad.city, ad.state, ad.zip_code, pay.transaction_id, pay.total, pay.total_cryptocurrency, com.service_fee, com.processor_fee
                    FROM users as u, addresses as ad, carts as c, payments as pay, commissions as com
                    WHERE (pay.id = ${paymentId}) and (pay.id = c.payment_id) and (c.user_id = u.id) and (ad.id = pay.address_id) and (com.id = pay.commision_id )        
                `.trim(),
        );
    }

    public async getPdfCartData(paymentId: number) {
        return await this.productsRepository.query(
            `SELECT distinct (p.id), p.name, p.price, c.quantity, c.product_price, c.offer_price
                    FROM users as u, addresses as ad, carts as c, products as p, payments as pay
                    WHERE (pay.id = ${paymentId}) and (pay.id = c.payment_id) and (c.product_id = p.id)                   
                `.trim(),
        );
    }

    /**
     * create the pdf of an specific order
     * @param paymentId id of the order
     * @returns Promise<any>
     */
    public async viewPdf(paymentId: number, response): Promise<any> {
        const path = require('path');
        this.logger.debug(`sendPdf: creating pdf of order... [order=${paymentId}]`, {
            context: ProductsService.name,
        });

        try {
            let pdfClienteData = await this.getPdfClientData(paymentId);
            let pdfCartData = await this.getPdfCartData(paymentId);

            if (pdfCartData[0]){                
                this.logger.debug(
                `sendPdf: success getting cart data of order id[orderId =${paymentId}]|${JSON.stringify(
                   pdfCartData,
                )}`,
                {
                    context: ProductsService.name,
                },
            );
            }else{                  
                this.logger.error(
                `sendPdf: error when getting cart data of order id[orderId =${paymentId}]`,
                {
                    context: ProductsService.name,
                },              );
                pdfCartData=[{
                    "id" : 1,
                    "name" : 'undefined, please try again',
                    "price" : 2000,
                    "quantity" : 1,
                    "product_price" : 2500,
                    "offer_price" : 0,
                }];              
            }

            if(pdfClienteData[0]){
               this.logger.debug(
                `sendPdf: success getting client data of order id[orderId =${paymentId}]|${JSON.stringify(
                   pdfClienteData,
                )}`,
                {
                    context: ProductsService.name,
                },);
            }else{
                this.logger.error(
                `sendPdf: error when getting cart data of order id[orderId =${paymentId}]`,
                {
                    context: ProductsService.name,
                }, );  
                pdfClienteData=[{
                    id:1,
                    "last_name": 'undefined',
                    "first_street": 'undefined',
                    "second_street": 'undefined',
                    "city": 'undefined',
                    "zip_code": 'undefined',
                    "transaction_id": 'undefined',
                    "total": 0,
                    "total_cryptocurrency": 0,
                    "service_fee": 0,
                    "processor_fee": 0,
                }];               
            }

            let today = new Date();
            let currentTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            let totalPrice;

            // Define font files
            var fonts = {
                Roboto: {
                    normal: path.resolve(__dirname, '../../../../reports', 'fonts', 'Roboto-Light.ttf'),
                    bold: path.resolve(__dirname, '../../../../reports', 'fonts', 'Roboto-Medium.ttf'),
                    italics: path.resolve(__dirname, '../../../../reports', 'fonts', 'Roboto-Italic.ttf'),
                    bolditalics: path.resolve(
                        __dirname,
                        '../../../../reports',
                        'fonts',
                        'Roboto-MediumItalic.ttf',
                    ),
                },
            };

            var PdfPrinter = require('pdfmake');
            var printer = new PdfPrinter(fonts);
            var fs = require('fs');
            let prueba = 'sucasas';
            //let buhocenterLogo = await this.convertImageToDataURL(path.resolve(__dirname,'../../../../pdf','assets','Logo-completo.png'),100);

            var docDefinition = {
                
           content: [
                    {
                        image: 'data:image/png;base64,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',
                        width: 200,
                        height: 150,
                        style: 'sideTable'
                    },
                    {
                        style: 'defaultStyle',
                        table: { 
                            headerRows: 1,
                            widths: [ 150, 300, 200],
                            heights:[ 10, 10, 10],
                            body: [
                                ['',{text: `Final Details for Order : ${pdfCartData[0].id}`, style: 'tableHeader',alignment: 'center'},''],
                                ['',{},''],
                            ]
                        },
                        layout: 'noBorders'
                    },
                    {
                        style: 'sideTable',
                        color: '#444',
                        table: {
                            widths: [ 170, 136,70],
                            headerRows: 2,
                            // keepWithHeaderRows: 1,
                            body: [
                                [{text: `Order Placed`, alignment: 'left', colSpan: 1, style: 'tableHeader'},{text: `${currentTime}`, alignment: 'left', colSpan: 2, style: 'tableHeader'} ,''],
                                [{text: `Buhocenter Order number`, alignment: 'left',style: 'tableHeader'},{text: `${pdfCartData[0].id}`, alignment: 'left', colSpan: 2, style: 'tableHeader'}, {text: `Invoice ID: pdfC`, alignment: 'left'}],
                                [{text: `Order Total`, alignment: 'left', style: 'tableHeader'},{text: `${pdfClienteData[0].total}`, alignment: 'left', colSpan: 2, style: 'tableHeader'},{text: `TransactionID:pd`, alignment: 'left' }],
                            ]
                        },
                        layout: 'noBorders'
                    },
                    {
                        style: 'fisrtTable',
                        color: '#444',
                        table: {
                            widths: [ '*', '*'],
                            headerRows: 2,
                            // keepWithHeaderRows: 1,
                            body: [
                                [{text: `Client data`, style: 'tableHeader', alignment: 'left', colSpan: 2}, ''],
                                [{text: `name: ${pdfClienteData[0].name}`, alignment: 'left'}, {text: `last name: ${pdfClienteData[0].last_name}`, alignment: 'left'}],
                                [{text: `email: ${pdfClienteData[0].email}`, alignment: 'left', colSpan: 2 },''],
                            ]
                        },
                        layout: 'noBorders'
                    },
                    
                    {
                        style: 'tableExample',
                        color: '#444',
                        table: {
                            
                            widths: [ '*', '*'],
                            // keepWithHeaderRows: 1,
                            body: [
                                [{text: 'Shipping Address', style: 'tableHeader'}, {text: `zip code: ${pdfClienteData[0].zip_code}`}],
                                [{text: `first street: ${pdfClienteData[0].first_street}`, alignment: 'left'}, {text: `second street: ${pdfClienteData[0].second_street}`}],
                                [{text: `city: ${pdfClienteData[0].city}`, alignment: 'left'}, {text: `state: ${pdfClienteData[0].state}`}],
                            ]
                        },
                        layout: 'noBorders'
                    },
                   {
                        style: 'tableExample',
                        color: '#444',
                        table: {
                            widths: [ '*',],
                            // keepWithHeaderRows: 1,
                            body: [
                                [{text: 'Products Ordered', style: 'header'}],
                                
                            ]
                        },
                        layout: 'noBorders'
                    },
                    {
                        style: 'tableClose',
                        color: '#444',
                        table: {
                            widths: [ '*', 50, 80, 80, 100],
                            
                            // keepWithHeaderRows: 1,
                            body: [
                                
                                [{text: 'Name', alignment: 'center', style: 'header'}, {text: 'Quantity', alignment: 'center', style: 'header'}, {text: 'Ind. price', alignment: 'center', style: 'header'},{text: 'Discount', alignment: 'center', style: 'header'},{text: 'Import', alignment: 'center', style: 'header'}],                                                       
                            ]
                        },
                        layout: {
                            fillColor: function(rowIndex, node, columnIndex) {
                                return rowIndex === 0 ? '#CAB776' : null;
                            },
                        },
                    },
                    
                    {
                        style: 'sideTable',
                        color: '#444',
                        alignment: 'center',
                        table: {
                            widths: [ 100, 100],
                            
                            // keepWithHeaderRows: 1,
                            
                            body: [
                                [{text: `Tax:`, style: 'tableHeader', alignment: 'left'}, {text: `${pdfClienteData[0].total_cryptocurrency}`, alignment: 'center'}],
                                [{text: `Total:`, style: 'tableHeader', alignment: 'left'}, {text: `${pdfClienteData[0].total}`, alignment: 'center'}],
                                [{text: `Total cryp:`, style: 'tableHeader', alignment: 'left'}, {text: `${pdfClienteData[0].total_cryptocurrency}`, alignment: 'center'}],
                                
                            ]
                        },
                        layout: 'noBorders'
                    },
                    
                ],
                styles: {
                    header: {
                        fontSize: 13,
                        bold: true,
                        margin: [0, 0, 0, 5],
                        color:'black'
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15],
                        color: 'white',
                        bold: false
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    },
                    leftTable: {
                        margin: [298, 5, 0, 15]
                    },
                
                    defaultStyle: {
                            margin: [0, -60, 0, 15]
                    },
                    footer: {
                        margin: [0, 0, 0, 15]
                    },
                    
                    fisrtTable: {
                        margin: [0, 30, 0, 15]
                    },
                    sideTable:{
                        margin: [0, 0, 0, 15]
                    },
                    tableClose:{
                         margin: [0, -14, 0, 15]
                    }
                }
            };

            pdfCartData.forEach(product =>
                docDefinition.content[6].table.body.push([
                    { text: `${product.name}`, style: 'tableHeader', alignment: 'center' },
                    { text: `${product.quantity}`, style: 'tableHeader', alignment: 'center' },
                    { text: `${product.product_price}`, style: 'tableHeader', alignment: 'center' },
                    { text: `${product.offer_price}`, style: 'tableHeader', alignment: 'center' },
                    {
                        text: `${(product.price * product.quantity).toFixed(2)}`,
                        style: 'tableHeader',

                        alignment: 'center',
                    },
                ]),
            );

            var options = {
                // ...
            };

            var pdfDoc = await printer.createPdfKitDocument(docDefinition, options);
            /*await pdfDoc.pipe(
                fs.createWriteStream(
                    path.resolve(__dirname + '../../../../../reports/pdfs/' + paymentId + '.pdf'),
                ),
            );

            
            pdfDoc.end();*/

            var chunks = [];
            var result;

            pdfDoc.on('data', function(chunk) {
                chunks.push(chunk);
            });
            pdfDoc.on('end', function() {
                result = Buffer.concat(chunks);

                response.contentType('application/pdf');
                response.send(result);
            });
            pdfDoc.end();

            return paymentId;
        } catch (e) {
            this.logger.error(
                `sendPdf: error when trying to create the pdf of the order with id[orderId =${paymentId}]|error=${JSON.stringify(
                    e.message,
                )}`,
                {
                    context: ProductsService.name,
                },
            );

            throw new BadRequestException('error when trying to create the pdf of the order...');

            return false;
        }
    }
}
