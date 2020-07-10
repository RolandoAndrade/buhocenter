import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { LoggerSettingsService } from '../modules/settings/services/logger.service';
import { UsersModule } from '../modules/users/users.module';
import { ProductsModule } from '../modules/products/products.module';
import { PaymentsModule } from '../modules/payments/payments.module';
import { CartsModule } from '../modules/carts/carts.module';
import { StatussModule } from '../modules/status/status.module';
import { AddressModule } from '../modules/address/address.module';
import { AuthModule } from '../modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from 'src/config/config.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { ThirdPartyModule } from '../modules/third-party/third-party.module';

dotenv.config();

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ProductsModule,
        PaymentsModule,
        StatussModule,
        AddressModule,
        CartsModule,
        DatabaseModule,
        ConfigModule,
        WinstonModule.forRootAsync({
            useClass: LoggerSettingsService,
        }),
        SendGridModule.forRoot({
            apikey: process.env.SENDGRID_API_KEY,
        }),
        NotificationsModule,
        ThirdPartyModule,
    ],
    controllers: [AppController],
    providers: [AppService, AllExceptionsFilter],
    exports: [AllExceptionsFilter],
})
export class AppModule {}
