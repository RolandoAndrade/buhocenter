import { Controller, Get, Param, Post, Body, ParseIntPipe, Query, Inject, Res, HttpStatus, Patch, Delete } from '@nestjs/common';
import { ProductsService } from '../services/products.service'
import { Product } from '../entities/product.entity'
import { 
	ProductDTO, ProductsAO, IdArrayDto,
	 ImageProductDto, DimensionProductDto,
	 InventoryProductDto
} from '../dto/products.dto'
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductTransactionsRepository } from '../transaction/products.transaction.service'

@Controller('products')
export class ProductsController {
	constructor (
		private readonly productsService: ProductsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		public service: ProductsService,
		@Inject(ProductTransactionsRepository)
		private readonly productTransactionsRepository: ProductTransactionsRepository
	) {}

	@Get('daily-recommendation')
	async getDailyProductsRecommendation(
		@Res() res: Response,
	): Promise<Response> {
		this.logger.info(
			`getDailyProductsRecommendation: products recomendados del dia `,
			{ context: ProductsController.name },
		);
		try {
			const products: Product[] = await this.productsService.getDailyProductsRecommendation();
			return res.status(HttpStatus.OK).send(products);
		} catch (e) {
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}


	@Get(':id')
	async getProductById(
		@Res() res: Response,
		@Param('id', new ParseIntPipe()) id: number,
	): Promise<Response> {
		this.logger.info(`getProductById: getting the product with id [id=${id}]`, { context: ProductsController.name });

		try {
			const product = await this.productsService.getProductById(id);
			return res.status(HttpStatus.OK).send(product);
		} catch (e) {
			this.logger.error(`Error obteniendo el product por el id ${id}`, { context: ProductsController.name });
			this.logger.error(`${e}`, { context: ProductsController.name });
			return res.status(HttpStatus.NOT_FOUND).send();
		}
	}

	@Get()
	async getProducts(
		@Res() res: Response,
		@Query('page', new ParseIntPipe()) page: number,
		@Query('catalogueId') catalogueId: number,
	): Promise<Response> {
		this.logger.info(
			`getProducts: [page=${page}|catalogueId=${catalogueId}]`,
			{ context: ProductsController.name },
		);
		try {
			const [products, total]: [Product[], number] = await this.productsService.getProducts(page, catalogueId);
			return res.status(HttpStatus.OK).send([products, total]);
		} catch (e) {
			this.logger.error(`Exception ${e}`);
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
		}
	}

	@Patch()
	async updateProductData(
		@Res() res: Response,
		@Body() updateProduct: Partial<ProductsAO>
	): Promise<Response>{
		try{
			this.logger.info(`
				updateProductData : updating the product [updateProduct=${JSON.stringify(updateProduct)}]`,
			 	{ context: ProductsController.name }
			);
			console.log(updateProduct);
			let response = await this.productTransactionsRepository.updateProductData(updateProduct);
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`updateProductData: error when loading the object[error=${JSON.stringify(e.message)}]`,
				{ context: ProductsController.name },
			);

			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Delete(':id')
	async deleteProduct(
		@Res() res: Response,
		@Param('id') deleteProductId: number
	): Promise<Response>{
		try{
			this.logger.info(
				`deleteProduct: deleting the product with id [deleteProductId=${deleteProductId}]`,
				 { context: ProductsController.name }
			);
			
			let response = await this.productTransactionsRepository.deleteProduct(deleteProductId);
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`deleteProduct: error when trying to delete the product with id[deleteProductId=${deleteProductId}]`,
				{ context: ProductsController.name }
			);
			
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Get('all/:id')
	async getAllProducts(
		@Res() res: Response
	): Promise<Response>{
		try{
			this.logger.info(
				`getAllProducts: getting all accessibles products`,
				 { context: ProductsController.name }
			);
			
			let response = await this.productTransactionsRepository.getAllProducts();
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`getAllProducts: error when trying to get all accessible products=${JSON.stringify(e.message)}`,
				{ context: ProductsController.name }
			);
			
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Post()
	async createProduct(
		@Res() res: Response,
		@Body() product :ProductsAO
	): Promise<Response>{
		try{			
			let response: Product = await this.productTransactionsRepository.createProduct(product);
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`createProduct: error when trying to create product=${JSON.stringify(e.message)}`,
				{ context: ProductsController.name }
			);
			
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Post('image')
	async saveProductImage(
		@Res() res: Response,
		@Body() data : ImageProductDto
	):Promise<Response>{
		try{
			this.logger.info(
				`saveProductImage:creating the imageName [product=${JSON.stringify(data)}]`,
				 { context: ProductsController.name }
			);
			
			let response = await this.productTransactionsRepository.saveProductImage(data.imageName, data.id);
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`saveProductImage: error when trying to associate product and image=${JSON.stringify(e.message)}`,
				{ context: ProductsController.name }
			);
			
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Post('dimension') 
	async saveProductDimension(
		@Res() res: Response,
		@Body() data : DimensionProductDto
	){
		try{
			this.logger.info(
				`saveProductDimension:creating the dimension for producto [product=${JSON.stringify(data)}]`,
				 { context: ProductsController.name }
			);
			
			let response = await this.productTransactionsRepository.saveProductDimension(data.dimension, data.id);
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`saveProductDimension: error when trying to associate product and dimension=${JSON.stringify(e.message)}`,
				{ context: ProductsController.name }
			);
			
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Post('inventory')
	async saveInventary(
		@Res() res: Response,
		@Body() data : InventoryProductDto
	):Promise<Response>{
		try{
			this.logger.info(
				`saveInventary:saving the inventory with id [product=${JSON.stringify(data)}]`,
				 { context: ProductsController.name }
			);
			
			let response = await this.productTransactionsRepository.saveInventary(data);
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`saveInventary: error when trying to associate quantity to product =${JSON.stringify(e.message)}`,
				{ context: ProductsController.name }
			);
			
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Patch('inventory')
	async updateInventory(
		@Res() res: Response,
		@Body() data : InventoryProductDto
	):Promise<Response>{
		try{
			this.logger.info(
				`updateInventory:updating the inventory with id [product=${JSON.stringify(data)}]`,
				 { context: ProductsController.name }
			);
			
			let response = await this.productTransactionsRepository.updateInventory(data);
			return res.status(HttpStatus.OK).send(response);
		} catch (e) {
			this.logger.error(
				`updateInventory: error when trying to update inventory=${JSON.stringify(e.message)}`,
				{ context: ProductsController.name }
			);
			
			return res.status(HttpStatus.BAD_REQUEST).send();
		}

	}

}
