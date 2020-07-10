import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { CustomerLoyaltyService } from './services/customer-loyalty.service';
import { CustomerLoyaltyRepository } from './repositories/customer-loyalty.repository';
import { SendPacketController } from './controllers/send-packet.controller';
import { SendPacketService } from './services/send-packet.service';
import { SendPacketRepository } from './repositories/send-packet.repository';
import { ThirdPartyController } from './controllers/third-party.controller';
import { UsersModule } from '../users/users.module';
import { PetromilesClientsCsv } from '../documents/infraestructure/csv/petromiles-clients.csv';
import { ConfigModule } from '../../config/config.module';
import { CsvGenerator } from '../documents/repositories/csv.generator';

@Module({
    imports: [HttpModule, forwardRef(() => UsersModule), ConfigModule],
    providers: [
        CustomerLoyaltyService,
        CustomerLoyaltyRepository,
        SendPacketService,
        SendPacketRepository,
        {
            provide: CsvGenerator,
            useClass: PetromilesClientsCsv,
        },
    ],
    exports: [CustomerLoyaltyService, SendPacketService],
    controllers: [ThirdPartyController, SendPacketController],
})
export class ThirdPartyModule {}
