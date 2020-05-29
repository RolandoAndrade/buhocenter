import { createQueryBuilder, Repository} from 'typeorm'
import { Injectable, Inject, BadRequestException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '../entities/product.entity'
import { ProductDTO, ProductsAO, DimensionDto} from '../dto/products.dto'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { ProductCategory } from '../entities/product-category.entity'
import { Category } from '../entities/category.entity'

@Injectable()
export class CategoriesService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,  
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>,  
        @InjectRepository( Category)
        private readonly  categoriesRepository: Repository< Category>, 
    ) {}
   
    async getAllCategorys():Promise<Category[]>{
        return await this.categoriesRepository.find();
    }

    public async getCategory(categoryId: number):Promise<Category>{
        return await this.categoriesRepository.findOne(categoryId);
    }

    public async createCategoryProduct(categoryId:number, product: Product){
        this.logger.debug(
            `createCategoryProduct: the category ${categoryId} is alredy associated to the product ${product.id}`,
            { context: CategoriesService.name }
        );
        let newCategoryProduct = new ProductCategory();
        newCategoryProduct.category = await this.categoriesRepository.findOne(categoryId);
        this.logger.debug(
            `createCategoryProduct: ${JSON.stringify(newCategoryProduct.category)}`,
            { context: CategoriesService.name }
        );
        newCategoryProduct.product = product;       
        await this.productCategoryRepository.save(newCategoryProduct);            
        
    }

    public async checkProductsCategories( categoryId: number, productId: number): Promise<boolean>{
        let productsCategories=await this.productCategoryRepository.find({
            where: { category : categoryId, product : productId},
        });

        if(productsCategories){            
             this.logger.info(
                `checkProductsCategories: the category ${categoryId} is alredy associated to the product ${productId}`,
                { context: CategoriesService.name }
            );
            return false;
        }else{
            return true;
        }
    }


    /**
     * Obtiene el listado de categorias
     */
    public async getCategories(): Promise<any> {
        try {
            this.logger.debug(`getCategories: executting query to get all categories`, { context: CategoriesService.name });
            return await this.categoriesRepository.find();
        } catch (e) {
            this.logger.error(`getCategories: catch error [error:${e.message}]`, { context: CategoriesService.name });
            return Response.error();
        }
    }

    /**
     * Obtiene el listado de categorias
     */
    public async getCataloguesByCatergory(id: number): Promise<Response> {
        try {
            this.logger.debug(`getCataloguesByCatergory: ejecutando query para obtener catalogues por category`, { context: CategoriesService.name });
            return await this.categoriesRepository.query(`
            SELECT ca.id AS id, ca.name AS name, ca.term AS term
            FROM catalogue ca, product_catalogue pctlg, product_category pctgr
            WHERE ca.id = pctlg.catalogue_id
                AND pctlg.product_category_id = pctgr.id
                AND pctgr.category_id = ${id}
            `.trim());
        } catch (e) {
            this.logger.error(`getCataloguesByCatergory: catch error [error:${e.message}]`, { context: CategoriesService.name });
            return Response.error();
        }
    }


    public async findCategory(categoryId : number):Promise<Category>{
        return await this.categoriesRepository.findOne(categoryId);
    }
}
