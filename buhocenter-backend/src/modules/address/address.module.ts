import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { Address } from './entities/address.entity';
import { UsersModule } from '../users/users.module';
import { StatussModule } from '../status/status.module';
import { AddressValidationRepository } from './repositories/address.repository';
import { AddressTransactionsRepository } from './transaction/address.transactions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Address]), HttpModule, UsersModule, StatussModule],
    controllers: [AddressController],
    providers: [AddressService, AddressValidationRepository, AddressTransactionsRepository],
    exports: [AddressService],
})
export class AddressModule {}
