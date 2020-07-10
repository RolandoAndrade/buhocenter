import { Injectable, Inject } from '@nestjs/common';
import { getManager, getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectConnection } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { Connection } from 'typeorm';
import { PaymentsService } from '../services/payments.service';
import { PaymentOrderDto } from '../dto/payments.dto';

@Injectable()
export class PaymentsTransactionsRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection,
        private readonly paymentsService: PaymentsService,
    ) {}
}
