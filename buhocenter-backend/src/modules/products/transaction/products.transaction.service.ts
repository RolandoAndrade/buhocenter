import { Injectable, Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { InjectConnection } from "@nestjs/typeorm";
import { Logger } from "winston";
import { Connection } from 'typeorm';
import { ProductsService } from "../services/products.service";
import { 
    ProductDTO ,ProductsAO,
    dimensionDto ,categoryDto,
    InventoryProductDto
} from '../dto/products.dto'
import { Product } from '../entities/product.entity'
import { Brand } from '../entities/brand.entity'
import { Provider } from '../entities/provider.entity'
import { Category } from '../entities/category.entity'
import { BrandsService } from '../services/brands.service'
import { ProvidersService } from '../services/providers.service'
import { CategoriesService } from '../services/categories.service'
import { CataloguesService } from '../services/catalogues.service'
import { Catalogue } from '../entities/catalogue.entity'

@Injectable()
export class ProductTransactionsRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection,
        private readonly productsService: ProductsService,
        private readonly brandsService: BrandsService,
        private readonly providersService: ProvidersService,
        private readonly categoriesService: CategoriesService,
        private readonly cataloguesService: CataloguesService
    ) {}


    public async updateProductData( product : Partial<ProductsAO> ): Promise<string> {
        this.logger.info(`updateProductData: starting update of producto : [product=${JSON.stringify(product)}]`,
            { context: ProductTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.productsService.updateUsersProduct(product.id , product);
        })
    }

    public async deleteProduct( productID : number ): Promise<string> {
        this.logger.info(`deleteProduct: starting delete of producto id: [product=${productID}]`,
            { context: ProductTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.productsService.deleteProduct(productID);
        })
    }

    public async getAllBrands(): Promise<Brand[]>{
        this.logger.info(
            `getAllBrands: getting all brands accessibles`,
            { context: ProductTransactionsRepository.name }
        );

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.brandsService.getAllBrands();
        })
    }  

    public async getAllProviders(): Promise<Provider[]>{
        this.logger.info(
            `getAllProviders: getting all brands accessibles`,
            { context: ProductTransactionsRepository.name }
        );

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.providersService.getAllProviders();
        })
    }

    public async getAllCategorys(): Promise<Category[]>{
        this.logger.info(
            `getAllCategorys: getting all categorys accessibles`,
            { context: ProductTransactionsRepository.name }
        );

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.categoriesService.getAllCategorys();
        })

    }

    public async getAllProducts(): Promise<Product[]>{
        this.logger.info(
            `getAllProducts: getting all products accessibles`,
            { context: ProductTransactionsRepository.name }
        );

         return await this.connection.transaction(async transactionalEntityManage => {
            return await this.productsService.getAllProducts();
        })
    }

    public async deleteMulyiplesProducts( productsID : number[] ): Promise<string> {
        this.logger.info(`deleteMulyiplesProducts: starting delete of products with ids : productsID=${ productsID}]`,
            { context: ProductTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.productsService.deletMultiplesProducts(productsID);
        })
    }

    public async createProduct(product:ProductsAO): Promise<Product>{
         this.logger.info(`createProduct: creating the product: product=${JSON.stringify(product)}]`,
            { context: ProductTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.productsService.createProduct(product);
        })
    }

    public async saveProductImage(imageName:string, productId:number): Promise<string>{
         this.logger.info(`createProduct: creating the product: product=${JSON.stringify(productId)}]`,
            { context: ProductTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.productsService.saveProductImage(imageName,productId);
        })
    }

    public async saveProductDimension(dimension:dimensionDto, productId): Promise<any>{
         this.logger.info(`createProduct: creating the product: product=${JSON.stringify(productId)}]`,
            { context: ProductTransactionsRepository.name });

        return await this.connection.transaction(async transactionalEntityManage => {
            return await this.productsService.createDimension(dimension.width, dimension.height, dimension.long
                ,productId);
        })
    }

    public async getCatalogues(): Promise<Catalogue[]>{
        this.logger.info(
            `getCatalogues: getting all Catalogues accessibles`,
            { context: ProductTransactionsRepository.name }
        );

         return await this.connection.transaction(async transactionalEntityManage => {
            return await this.cataloguesService.getCatalogues();
        })
    }

    public async catalogueSaveControl(catalogueData: categoryDto): Promise<any>{
        this.logger.info(
            `catalogueSaveControl:`,
            { context: ProductTransactionsRepository.name }
        );

         return await this.connection.transaction(async transactionalEntityManage => {
            let productObj :Product= await this.productsService.findProduct(catalogueData.product.id);
            let categoryObj : Category= await this.categoriesService.findCategory(catalogueData.category.id);
            return await this.cataloguesService.asocciateProductCatalogue(catalogueData.id,productObj,categoryObj);
        })

    }

    public async saveInventary(data: InventoryProductDto): Promise<any>{
         this.logger.info(
            `catalogueSaveControl:`,
            { context: ProductTransactionsRepository.name }
        );

         return await this.connection.transaction(async transactionalEntityManage => {           
            return await this.productsService.saveInventory(data.quantity, data.product.id);
        })
    }

    public async updateInventory(data: InventoryProductDto) :Promise<any>{
        this.logger.info(
            `catalogueSaveControl:`,
            { context: ProductTransactionsRepository.name }
        );

         return await this.connection.transaction(async transactionalEntityManage => {           
            return await this.productsService.updateInventory(data.quantity, data.product.id);
        })
    }
}