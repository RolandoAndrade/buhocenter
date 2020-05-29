import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTransactionsRepository } from './transaction/products.transaction.service'
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Product } from './entities/product.entity';
import {ProductRating}  from './entities/product-rating.entity'
import { ServicesModule } from '../services/services.module'
import { ProductInventory } from './entities/product-inventory.entity'
import { Provider } from './entities/provider.entity'
import { Brand } from './entities/brand.entity'
import { ProductDimension } from './entities/product-dimension.entity'
import { StatussModule } from '../status/status.module'
import { ProductCategory } from './entities/product-category.entity'
import { ProductCatalogue } from './entities/product-catalogue.entity'
import { Catalogue } from './entities/catalogue.entity'
import { Category } from './entities/category.entity'
import { ProductProvider } from './entities/product-provider.entity'
import { BrandsController } from './controllers/brand.controllers'
import { ProvidersController } from './controllers/provider.controllers'
import { BrandsService } from './services/brands.service'
import { ProvidersService } from './services/providers.service'
import { CategoriesService } from'./services/categories.service'
import { CataloguesService } from './services/catalogues.service'
import {CategoriesController} from './controllers/categories.controller';
import { ProductPhoto } from './entities/product-photo.entity'
import { CataloguesController } from './controllers/catalogues.controllers'


@Module({
  	imports: [
    	TypeOrmModule.forFeature([Product, ProductRating, ProductInventory, 
    		Provider, Brand, ProductDimension, ProductCategory, ProductCatalogue,
    		Catalogue, Category, ProductProvider,ProductPhoto]),
    	ServicesModule,StatussModule
  	],
  	controllers: [
  		ProductsController,BrandsController,
		  ProvidersController,CategoriesController,
      CataloguesController
	],
  	providers: [
  		ProductsService, BrandsService, ProvidersService,
  		ProductTransactionsRepository, CataloguesService,
      CategoriesService
  	],
  	exports: [ProductsService]
})
export class ProductsModule {}
