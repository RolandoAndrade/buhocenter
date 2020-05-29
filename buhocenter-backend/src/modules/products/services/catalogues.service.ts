import { createQueryBuilder, Repository} from 'typeorm'
import { Injectable, Inject, BadRequestException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductDTO, ProductsAO, DimensionDto, IdArrayDto} from '../dto/products.dto'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { STATUS } from '../../../config/constants';
import { Status } from '../../status/entities/status.entity'
import { StatusService } from '../../status/services/status.service'
import { ProductCatalogue } from '../entities/product-catalogue.entity'
import { Catalogue } from '../entities/catalogue.entity'
import { ProductCategory } from '../entities/product-category.entity'

@Injectable()
export class CataloguesService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,         
        @InjectRepository(Catalogue)
        private readonly catalogueRepository: Repository<Catalogue>,
        @InjectRepository(ProductCatalogue)
        private readonly productCatalogueRepository: Repository<ProductCatalogue>,
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>

    ) {}

    private async getCatalogue(catalogueId:number){
        return await this.catalogueRepository.findOne(catalogueId);
    }

    public async getCatalogues(){
    	return await this.catalogueRepository.find();
    }

    public async createCatalogueCateguery(catalogueId :number, categoryProduct : ProductCategory): Promise<ProductCatalogue>{
        let newProductCatalogue = new ProductCatalogue ();        
        newProductCatalogue.catalogue = await this.getCatalogue(catalogueId);
        newProductCatalogue.productCategory =categoryProduct;
        await this.productCatalogueRepository.save(newProductCatalogue);

        return newProductCatalogue;
    }

    public async asocciateProductCatalogue (catalogueId: number , product , category){
        console.log(product);
        console.log(category);
         let foundCatalogue:Catalogue = await this.catalogueRepository.findOne(catalogueId);
         let newProductCategory= await this.productCategoryRepository.findOne({
             where:{ product:product, category:category }
         });

         let newCatalogueProduct = new ProductCatalogue();
         newCatalogueProduct.catalogue=foundCatalogue;
         newCatalogueProduct.productCategory= newProductCategory;
         await this.productCatalogueRepository.save(newCatalogueProduct);
    }
}

