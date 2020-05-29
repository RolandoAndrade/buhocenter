import { createQueryBuilder, Repository} from 'typeorm'
import { Injectable, Inject, BadRequestException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '../entities/product.entity'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { Provider } from '../entities/provider.entity'
import { ProductProvider } from '../entities/product-provider.entity'


@Injectable()
export class ProvidersService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(Provider)
        private readonly providerRepository: Repository<Provider>,
        @InjectRepository( ProductProvider)
        private readonly  productProviderRepository: Repository< ProductProvider>, 
    ) {}
    
    public async getProvider(providerId : number):Promise<Provider>{
        return await this.providerRepository.findOne(providerId);
    }

    async getAllProviders(): Promise<Provider[]>{
        return await this.providerRepository.find();
    }


    public createProvider(providerId: number, product: Product){
        return new Promise(async resolve => { 
            console.log('product', product);
            console.log('providerId', providerId);
            let newProductProvider = new ProductProvider();
            newProductProvider.product = product;
            newProductProvider.provider = await this.providerRepository.findOne(providerId);
            let maybeSave = await this.checkProductProviders(providerId, product.id); 
            if(maybeSave){
                await this.productProviderRepository.save(newProductProvider);
            }
            resolve(newProductProvider);
        });
        //hay que asegurar que la promesa devuelva algo, asi que devuelvo un true
        //esto pasa dentro del Promise.all(array.map())
        return true;
    }

    public async checkProductProviders(providerId: number, productId: number): Promise<boolean>{
        let productsProviders = await this.productProviderRepository.find({
            where: `provider_id = ${providerId} AND product_id = ${productId}`
        });

        console.log('productsProviders', productsProviders);

        if(productsProviders.length){
            this.logger.info(
                `checkProductProviders: the provider ${providerId} is alredy associated to the product ${productId} ${JSON.stringify(productsProviders)}`,
                { context: ProvidersService.name }
            );
            return false;
        }else{
            return true;
        }
    }
}

