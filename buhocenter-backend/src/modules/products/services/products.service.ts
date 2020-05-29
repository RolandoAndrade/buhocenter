import { createQueryBuilder, Repository, EntityManager, UpdateResult} from 'typeorm'
import { Injectable, Inject , BadRequestException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {map} from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { STATUS } from '../../../config/constants';

import { 
    ProductDTO, InventoryProductDto,
    ProductsAO, DimensionDto, 
    IdArrayDto,dimensionDto,
    idDto
} from '../dto/products.dto'

import { Product } from '../entities/product.entity'
import { Customer } from '../../users/entities/customer.entity'
import { ProductRating } from '../entities/product-rating.entity';
import { ProductInventory } from '../entities/product-inventory.entity'
import { ProductDimension } from '../entities/product-dimension.entity'
import { Status } from '../../status/entities/status.entity'
import { ProductCategory } from '../entities/product-category.entity'
import { ProductCatalogue } from '../entities/product-catalogue.entity'
import { ProductProvider } from '../entities/product-provider.entity'
import { StatusService } from '../../status/services/status.service'
import { BrandsService } from '../services/brands.service'
import { ProvidersService } from '../services/providers.service'
import { CategoriesService } from'../services/categories.service'
import { ProductPhoto } from '../entities/product-photo.entity'
import { CataloguesService } from '../services/catalogues.service'

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
        @Inject(StatusService)
        private readonly statusService:StatusService,
        @Inject(BrandsService)
        private readonly brandsService:BrandsService,
        @Inject(ProvidersService)
        private readonly providersService:ProvidersService,
        @Inject(CategoriesService)
        private readonly categoriesService:CategoriesService,
        @Inject(CataloguesService)
        private readonly cataloguesService:CataloguesService,        
        @InjectRepository(ProductPhoto)
        private readonly productPhotoRepository: Repository<ProductPhoto>, 
    ) {}

    /**
     * Returns the appreciations emitted to a product array
     * @param products products array to obtain its appreciations
     */
    private async getProductAverageRating(products: Product[]): Promise<void> {
        for await (const product of products) {
            product.productRatings = await this.productRatingsRepository.query(`
            SELECT ROUND(AVG(CP.rating)) as rating, COUNT(*) as total
                FROM product_rating CP
                WHERE CP.product_id = ${product.id}
            `.trim())

            this.logger.debug(`getProductAverageRating [id=${product.id}|productRatings=${
                JSON.stringify(product.productRatings)}]`);
        }
    }

    /**
     * Returns the quantity available in inventory according to a product
     * @param productId product id to obtain the inventory availability
     * @returns Promise<ProductInventory>
     */
    public async getProductInventoryAvailability(productId: number): Promise<ProductInventory> {
        this.logger.debug(`getProductInventoryAvailability: [productId=${productId}]`, { context: ProductsService.name });

        return this.productInventoriesRepository.findOne({
            where: `product_id = ${productId} AND (status_id IN (${STATUS.REJECTED.id}, ${STATUS.PROCESSED.id}, ${STATUS.RESERVED.id})
                OR status_id IS NULL)`,
            order: {
                id: 'DESC',
            },
        })
    }

    public async getMinimumProductAvailable(productId: number): Promise<Product> {
        this.logger.debug(`getMinimumProductAvailable: [productId=${productId}]`, { context: ProductsService.name });

        return this.productsRepository.findOne({
            where: { id: productId }
        })
    }

    /**
     * Sets the checkout id to the product inventory
     * @param productId product id which will be modified
     * @param checkoutId checkout id which will be set to inventory
     * @param transactionalEntityManager transactional entity manager
     */
    public async updateProductInventorySetCheckout(
        productId: number,
        checkoutId: number,
        transactionalEntityManager: EntityManager,
    ): Promise<UpdateResult> {
        this.logger.debug(`updateProductInventorySetCheckout: [checkoutId=${
            checkoutId}|productId=${typeof productId}]`, { context: ProductsService.name });

        const productInventoryTransactionRepository: Repository<ProductInventory> = transactionalEntityManager.getRepository(
            ProductInventory,
        );

        const update= await productInventoryTransactionRepository.update({ product: { id: productId }}, { checkout: { id: checkoutId }});

        return update;
    }

    /**
     * Modifies the product inventory of the product with a status according to a checkout
     * @param checkoutId checkout id that reduces the inventory
     * @param statusId status id to set to product inventory
     * @param transactionalEntityManager 
     */
    public async updateProductInventoryWithCheckout(
        checkoutId: number,
        statusId: number,
        transactionalEntityManager: EntityManager,
    ): Promise<UpdateResult> {
        this.logger.debug(`updateProductInventoryWithCheckout: [checkoutId=${
            checkoutId}|statusId=${statusId}]`, { context: ProductsService.name });

        const productInventoryTransactionRepository: Repository<ProductInventory> = transactionalEntityManager.getRepository(
            ProductInventory,
        );

        return productInventoryTransactionRepository.update({ checkout: { id: checkoutId }}, { status: { id: statusId }});
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
        this.logger.debug(`updateProductInventory: [productInventory=${
            JSON.stringify(productInventory)}]`, { context: ProductsService.name });

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
        this.logger.debug(`getProductById: [id=${id}]`, { context: ProductsService.name });

        const product: Product = await this.productsRepository.findOne({
            where: { id },
            relations: [
                'photos',
                'productProvider',
                'productProvider.provider',
                'productDimensions',
                'brand',
                'offers',
                'offers.offer',
                'offers.offer.status',
                'questions',
            ],
        });

        await this.getProductAverageRating([product]);

        product.productInventories = [await this.getProductInventoryAvailability(id)];

        return product;
    }

    /**
     * Returns the products according the parameters received
     * @param page page to start listing products
     * @param catalogueId catalogue id which products must belong to
     */
    public async getProducts(page: number = 1, catalogueId: number = 1): Promise<[Product[], number]> {
        this.logger.debug(`getProducts: [page=${page}|catalogueId=${catalogueId}]`, { context: ProductsService.name });
        
        const take: number = 8;

        let [products, total]: [Product[], number] = await this.productsRepository.findAndCount({
            where: `catalogue.id = ${catalogueId} AND status.id = ${STATUS.ACTIVE.id}`,
            join: {
                alias: 'products',
                innerJoinAndSelect: {
                    photos: 'products.photos',
                    productProvider: 'products.productProvider',
                    provider: 'productProvider.provider',
                    productCategories: 'products.productCategories',
                    productCatalogues: 'productCategories.productCatalogues',
                    catalogue: 'productCatalogues.catalogue',
                    status: 'products.status'
                },
            },
            order: {
                id: 'ASC',
            },
            skip: take * (page - 1),
            take,
        });

        let productsFiltered = [];

        for await (const i of products) {
            console.log(i);
            const inventoryAvailable = await this.getProductInventoryAvailability(i.id);

            if (inventoryAvailable.availableQuantity > i.minimumQuantityAvailable) {
                productsFiltered.push(i);
            }
        }

        await this.getProductAverageRating(productsFiltered);

        return [productsFiltered, total];
    }

    async findProduct(ProductID: number): Promise<Product> {
        return await this.productsRepository.findOne(ProductID);
    }

    /**
     * Obtiene el listado de products recomendados del dia
     */
    public async getDailyProductsRecommendation(): Promise<Product[]> {
        this.logger.debug(`getDailyProductsRecommendation: ejecutando query`, { context: ProductsService.name });
        let products: Product[] = await this.productsRepository.find({
            where: `status.id = ${STATUS.ACTIVE.id}`,
            join: {
                alias: 'products',
                innerJoinAndSelect: {
                    photos: 'products.photos',
                    productProvider: 'products.productProvider',
                    provider: 'productProvider.provider',
                    productCategories: 'products.productCategories',
                    productCatalogues: 'productCategories.productCatalogues',
                    catalogue: 'productCatalogues.catalogue',
                    status: 'products.status',
                },
            },
        });

        await this.getProductAverageRating(products);
        products = this.randomProducts(products);
        return products;
    }

     randomProducts(products: Product[]): Product[] {
        const randomProducts = products.sort((a, b) => (Math.random() - 0.5));
        return [...randomProducts].slice(0, 5);
    }

    async updateUsersProduct( productId : number , updatedProduct  ){
        let active= STATUS.ACTIVE.id;
        let verifyProduct= await this.productsRepository.findOne({
            where: { id: productId, status: active},
        });

        let maybeProviderArray,maybeCategoryArray;

        if (!verifyProduct){
            throw new BadRequestException('that Product is not accesable for the system');            
        } 
        else{            
            this.logger.debug(
                `updateUsersProduct: [id=${JSON.stringify(updatedProduct)}]`,
                { context: ProductsService.name }
            );       

            let keys = Object.entries(updatedProduct);                  
            for(var i=0 ; i < keys.length ;i++) 
            {               
                switch (keys[i][0]) {

                    case  "productName":
                    if (keys[i][1] as string==''){
                        this.logger.info(
                            `updateUsersProduct: name not declare, not updating name..`,
                            { context: ProductsService.name }
                        );      
                    }else{
                        verifyProduct.name = keys[i][1] as string;
                    }

                    break;

                    case  "description":
                    if (keys[i][1] as string==''){
                        this.logger.info(
                            `updateUsersProduct: description not declare, not updating description..`,
                            { context: ProductsService.name }
                        ); 
                    }else{
                        verifyProduct.description = keys[i][1] as string;   
                    }

                    break;
                    
                    case  "price":
                    if(keys[i][1] as number==0){             
                        this.logger.info(
                            `updateUsersProduct: price not declare, not updating price..`,
                            { context: ProductsService.name }
                        ); 
                    }else{
                        verifyProduct.price = keys[i][1] as number;     
                    }
                    break;                      

                    case  "shippingPrice":
                    if(keys[i][1] as number==0){
                        this.logger.info(
                            `updateUsersProduct: shipping price not declare, not updating shipping price..`,
                            { context: ProductsService.name }
                        ); 
                    }else{
                        verifyProduct.shippingPrice = keys[i][1] as number;
                    }                                                                  
                   
                    break;

                    case "category":  
                    let maybeCategory: idDto= keys[i][1] as idDto;
                    if(maybeCategory.id as number==0){
                        this.logger.info(
                            `updateUsersProduct: category not declare, not updating category..`,
                            { context: ProductsService.name }
                        ); 
                    }else{
                        console.log("saving category...");
                        let maybeCategoryArray:number = keys[i][1] as number;
                        await this.categoriesService.createCategoryProduct(
                            maybeCategoryArray,verifyProduct 
                        ) ;
                    }     
                    
                    break;

                    case  "brand":
                    if(keys[i][1] as number==0){
                        this.logger.info(
                            `updateUsersProduct: brand not declare, not updating brand...`,
                            { context: ProductsService.name }
                        ); 
                    }else{
                        verifyProduct.brand = await this.brandsService.getBrand(keys[i][1] as number);
                    }

                    break;    

                    case "minimumQuantityAvailable":
                    if(keys[i][1] as number==0){
                        this.logger.info(
                            `updateUsersProduct: minimumQuantityAvailable not declare, not updating minimumQuantityAvailable...`,
                            { context: ProductsService.name }
                        ); 
                    }else{
                        verifyProduct.minimumQuantityAvailable = keys[i][1] as number;  
                    } 

                    break; 



                    case "provider":   
                    let maybeProviderArray: IdArrayDto = keys[i][1] as IdArrayDto;                     
                    let maybeSaveProvider= maybeProviderArray.id.length;
                    //**en caso de que se quiera asociar varias proveedores a un mismo producto,
                        //*siempre sera un array, solo que estara vacio o no
                        //*elemento llamara a la funcion crear categoria producto de manera asincrona
                        //*todas esas promesas son almacenadas en un array de promesas
                        //*y Promise.all se encarga de esperar a que cada una de esas promesas en el
                        //**array se resuelvan  
                    if( maybeSaveProvider==0){
                        this.logger.info(
                            `updateUsersProduct: provider not declare, not updating provider...`,
                            { context: ProductsService.name }
                        ); 
                    }else{                                                      
                        const status = 
                        Promise.all(
                            maybeProviderArray.id.map(async(value)=>{
                                await this.providersService.createProvider(
                                    value,verifyProduct
                                )
                            })
                        );   
                    }                                                                                                                                                              
                    break;                    
                                                                                    
                }                        
            }                      
        }

    await this.productsRepository.save(verifyProduct);          
    this.logger.info(
        `updateUsersProduct: product updated and save succesfully [verifyProduct=${JSON.stringify(verifyProduct)}]`,
        { context: ProductsService.name }
    );

    return "product updated succesfully";
    }


    async deleteProduct(productId : number ){
        let active= STATUS.ACTIVE.id;
        let findProduct= await this.productsRepository.findOne({
            where:{ id: productId, status: active},
        });

        if (!findProduct){
            throw new BadRequestException('product not found or not accesable');            
        } else{
            let unaccesable= await this.statusService.getStatus(STATUS.INACTIVE.id);
            findProduct.status=unaccesable;

            await this.productsRepository.save(findProduct);
            this.logger.info(
                `deleteProduct: product deleted succesfully [verifyProduct=${productId}]`,
                { context: ProductsService.name }
            );
            return "product deleted sucesfully";
        }
    }

    public async getAllProducts():Promise<Product[]>{
        let active= STATUS.ACTIVE.id;
        return await this.productsRepository.find({
            where: { status: active },
        })
    }

    public async deletMultiplesProducts(productsArray : number[]):Promise<string>{
        const status = 
            Promise.all(
                productsArray.map(async(value)=>{
                    await this.deleteProduct(
                        value
                    )
                })
            );   
            
        return "products deleted sucesfully";
    }

    public async createProduct(product: ProductsAO): Promise<Product>{
        let active = STATUS.ACTIVE.id;
        let newProduct = new Product();
        newProduct.name = product.productName;
        newProduct.description = product.description;
        newProduct.price =  product.price;
        newProduct.shippingPrice = product.shippingPrice;
        newProduct.minimumQuantityAvailable = product.minimumQuantityAvailable;
        newProduct.status = await  this.statusService.getStatus(active);
        newProduct.brand =  await this.brandsService.getBrand(product.brand.id);                   
        await this.productsRepository.save(newProduct);

        console.log(`el id de categoria es =${product.category.id}`);

        await this.categoriesService.createCategoryProduct(
            product.category.id, newProduct 
        );
     

        if(product.provider.id.length!==0){
            console.log("entro en proveedor", product.provider);
            const status = 
                Promise.all(
                    product.provider.id.map(async(value)=>{
                        await this.providersService.createProvider(
                            value,newProduct
                        )
                    }))
        }
        
        return newProduct;
    }



    async createDimension(newWidth: string , newHeight: string, newLong:string , verifiedProduct:number): Promise<any>{
        let newDimension= new ProductDimension();
        let foundProduct= await this.productsRepository.findOne(verifiedProduct);
        newDimension.width = newWidth;
        newDimension.height = newHeight;
        newDimension.long = newLong;
        newDimension.product= foundProduct;        
        await this.productDimensionRepository.save(newDimension);
        
        return true;       
    } 

    async saveProductImage(imageName:string, productId:number): Promise<string>{
        let imageProduct:Product = await this.productsRepository.findOne(productId);
        console.log(`producto = ${JSON.stringify(imageProduct)}`);
        let newProductPhoto= new ProductPhoto();
        newProductPhoto.product=imageProduct;
        newProductPhoto.content=imageName;         
        await this.productPhotoRepository.save(newProductPhoto);
        return "product associate with image!";
    }

    public async saveInventory(quantity,productId): Promise<string>{
        let newProductInventory= new ProductInventory();
        let foundProduct = await this.productsRepository.findOne(productId);
        newProductInventory.product= foundProduct;
        newProductInventory.availableQuantity=quantity;       
        await this.productInventoriesRepository.save(newProductInventory);
        return "inventorio guardado";
    }

    public async updateInventory( quantity: number, productId:number): Promise<string>{
        let foundProduct = await this.productsRepository.findOne(productId);
        let foundInventory = await this.productInventoriesRepository.findOne({
            where:{ product:foundProduct }
        });
        foundInventory.availableQuantity=quantity;

        await this.productInventoriesRepository.save(foundInventory);
        return "inventario actualizado exitosamente";
    }

}

