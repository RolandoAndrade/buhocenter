import {Controller, Get, Param, Post, Body, ParseIntPipe, Query, Inject, Res, HttpStatus, Delete, UseGuards} from '@nestjs/common';
import { CartsService } from '../services/carts.service';
import { CartProductDTO } from '../dto/cartProduct.dto';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CartServiceDTO } from '../dto/cartService.dto';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'))
@Controller('carts')
export class CartsController {
	constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		public readonly service: CartsService,
	) {}


	@Post('products')
	async associateProductsCart(
		@Res() res: Response,
		@Body() body: CartProductDTO
	): Promise<Response> {
		try {
			const response = await this.service.asociateProductCart(body);
			return res.status(HttpStatus.OK).send(response);
		}
		catch(e){
			return res.status(HttpStatus.BAD_REQUEST).send();
		} 
	}

	@Post('services')
	async associateCartServices(
		@Res() res: Response,
		@Body() body: CartServiceDTO,
	) {
		this.logger.info(`associateCartServices: asociando el service al carrito`, { context: CartsController.name });
			const response = await this.service.asociateServiceCart(body);
			return res.status(HttpStatus.OK).send(response);
	}

	@Get('client/:id')
	async getCartProductsBycustomerID(
		@Res() res: Response,
		@Param('id', new ParseIntPipe()) id: number,
	) {
		try {
			this.logger.info(`getCartProductsBycustomerID: obteniendo el carrito y products, customer [id=${id}]`, { context: CartsController.name });
			const response = await this.service.findCartProduct(id);
			return res.status(HttpStatus.OK).send({cart: response});
		} catch (e) {
			this.logger.error(`getCartProductsBycustomerID: catch error [message=${e.message}]`, { context: CartsController.name });
			return  res.status(HttpStatus.BAD_REQUEST).status(500);
		}
	}

	@Delete('products/:id')
	async deleteProductCart(
		@Res() res: Response,
		@Param('id', new ParseIntPipe()) id: number,
	): Promise<Response> {
		try {
			this.logger.info(`deleteProductCart: eliminando  item product carrito  [id=${id}]`, { context: CartsController.name });
			const response: boolean = await this.service.dropProductCart(id);
			if (response) {
				return res.status(HttpStatus.OK).send({message: 'Item eliminado con exito'});
			} else {
				return res.status(HttpStatus.BAD_REQUEST).send({message: 'ID no existe'});
			}
		} catch (e) {
			this.logger.error(`deleteProductCart: eliminando  item product carrito  [id=${id}]`, { context: CartsController.name });
			return  res.status(HttpStatus.BAD_REQUEST).status(500);
		}
	}
}
