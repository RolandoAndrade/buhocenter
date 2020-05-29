import { Controller, Get, Param, Post, Body, ParseIntPipe, Query, Inject, Res, HttpStatus, Patch } from '@nestjs/common';
import { ProductsService } from '../services/products.service'
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductTransactionsRepository } from '../transaction/products.transaction.service'
import { Brand } from '../entities/brand.entity'
import { categoryDto } from '../dto/products.dto'

@Controller('catalogues')
export class CataloguesController {

	constructor (		
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,		
		@Inject(ProductTransactionsRepository)
		private readonly productTransactionsRepository: ProductTransactionsRepository
	) {}


	@Get()
	async getCatalogues(
		@Res() res: Response
	): Promise<Response>{
		this.logger.info(
			`getCatalogues: getting all Catalogues available`,
			 { context: CataloguesController.name }
		);
		try{
			let catalogues = await this.productTransactionsRepository.getCatalogues();		
			return res.status(HttpStatus.OK).send({catalogues});
		}
		catch(e){
			this.logger.info(
				`getCatalogues: error when trying to get all available Catalogues[error=${e.message}]`,
				 { context: CataloguesController.name }
			);
			return res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Post()
	async saveCatalogue(
		@Res() res: Response,
		@Body() body: categoryDto
	):Promise<Response>{
		this.logger.info(
			`getCatalogues:associating Catalogue`,
			 { context: CataloguesController.name }
		);
		try{
			let catalogues = await this.productTransactionsRepository.catalogueSaveControl(body);		
			return res.status(HttpStatus.OK).send({catalogues});
		}
		catch(e){
			this.logger.info(
				`getCatalogues: error when trying to get associate catalogue[error=${e.message}]`,
				 { context: CataloguesController.name }
			);
			return res.status(HttpStatus.BAD_REQUEST).send();
		}

	}


}
