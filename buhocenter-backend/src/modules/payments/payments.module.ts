import { Module, HttpModule } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { purchasesEntities } from './entities';
import { ProxyService } from './services/proxy.service';
import { PaymentGatewayRepository } from './repositories/payment-gateway.repository';
import { ProductsModule } from '../products/products.module';
import { CheckoutsService } from './services/checkouts.service';
import { PaymentsTransactionsRepository } from './transactions/payments.transactions.service';
import { PlatformManagementModule } from '../platform-management/platform-management.module';
import { StatussModule } from '../status/status.module';
import { CartsModule } from '../carts/carts.module';

@Module({
    imports: [
        CartsModule,
        ProductsModule,
        StatussModule,
        PlatformManagementModule,
        TypeOrmModule.forFeature(purchasesEntities),
        HttpModule.register({
            timeout: 20000,
            maxRedirects: 5,
        }),
    ],
    providers: [
        PaymentsTransactionsRepository,
        PaymentGatewayRepository,
        PaymentsService,
        ProxyService,
        CheckoutsService,
    ],
    controllers: [PaymentsController]
})
export class PaymentsModule {}
