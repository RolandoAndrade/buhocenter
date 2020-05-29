import { Controller, Inject, Get, Res, Param, ParseIntPipe, HttpStatus, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProxyService } from '../services/proxy.service';
import { PaymentsService } from '../services/payments.service';
import { UTRUST_PAYMENT_STATUS } from '../../../config/constants';
import { PaymentsTransactionsRepository } from '../transactions/payments.transactions.service';
import { PaymentOrderDto } from '../dto/payments.dto';
import { join } from 'path';

@Controller('payments')
export class PaymentsController {

    constructor (
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly paymentsService: PaymentsService,
		private readonly paymentsTransactionRepository: PaymentsTransactionsRepository
	) {}

	// Se ejecuta una vez se haya realizado el pago por parte del cliente. Puede servir para manejar la lógica interna de la
	// actualización de estatus de la orden
	@Get('/return')
	async returnPaymentOrder(
		@Res() res: Response,
		@Body() transactionBody
	) {
		this.logger.info(`returnPaymentOrder [transactionBody=${JSON.stringify(transactionBody)}]`, { context: PaymentsController.name });
		res.sendFile(join(process.cwd(), '/src/templates/landing.html'));
	}

	@Post('/update')
	async updatePaymentOrder(
		@Body() paymentOrder: PaymentOrderDto
	) {
		this.logger.info(`updatePaymentOrder [paymentOrder=${JSON.stringify(paymentOrder)}]`, { context: PaymentsController.name });

		return this.paymentsTransactionRepository.updateOrder(paymentOrder);
	}

	@Get('/cancel')
	async cancelPaymentOrder(
		@Res() res: Response,
		@Body() transactionBody
	) {
		this.logger.info(`cancelPaymentOrder [transactionBody=${JSON.stringify(transactionBody)}]`, { context: PaymentsController.name });
		res.sendFile(join(process.cwd(), '/src/templates/landing.html'));
	}

	@Post()
	async executePayment(
		@Res() res: Response,
		@Body() order
	): Promise<Response> {
		this.logger.info(`executePayment: ejecutando el pago [order=${JSON.stringify(order)}]`, { context: PaymentsController.name });
		
		try {
			const paymentUrl: string = await this.paymentsTransactionRepository.createOrder(order);
			return res.status(HttpStatus.OK).send({ redirectUrl: paymentUrl });
		} catch(e) {
			this.logger.error(`Error executing payment e=[${e}] ${JSON.stringify(e)}`);
		}
	}

}
