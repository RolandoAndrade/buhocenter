import { Test, TestingModule } from '@nestjs/testing';
import { CustomerLoyaltyService } from './customer-loyalty.service';
import { WinstonModule } from 'nest-winston';
import { LoggerSettingsService } from '../../settings/services/logger.service';
import { CustomerLoyaltyRepository } from '../repositories/customer-loyalty.repository';
import { forwardRef, HttpModule } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { LanguagesService } from '../../users/services/languages.service';
import { LanguageRepository } from '../../users/repositories/language.repository';
import { AuthService } from '../../auth/services/auth.service';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { repositoryMockFactory } from '../../../../test/mock.functions';
import { PassportModule } from '@nestjs/passport';
import { NotificationsModule } from '../../notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { CsvGenerator } from '../../documents/repositories/csv.generator';
import { PetromilesClientsCsv } from '../../documents/infraestructure/csv/petromiles-clients.csv';
import { UsersModule } from '../../users/users.module';
import { ConfigModule } from '../../../config/config.module';
import { SendPacketService } from './send-packet.service';
import { SendPacketRepository } from '../repositories/send-packet.repository';

xdescribe('customer loyalty service', () => {
    let service: CustomerLoyaltyService;

    beforeEach(async () => {
        process.env.JWT_SECRET = 'key4test';
        process.env.JWT_EXPIRES_IN = '60s';
        process.env.SENDGRID_API_KEY = 'SG.NONE';
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomerLoyaltyService,
                CustomerLoyaltyRepository,
                SendPacketService,
                SendPacketRepository,
                {
                    provide: CsvGenerator,
                    useClass: PetromilesClientsCsv,
                },
                JwtStrategy,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
            imports: [
                HttpModule,
                forwardRef(() => UsersModule),
                ConfigModule,
                SendGridModule.forRoot({
                    apikey: process.env.SENDGRID_API_KEY,
                }),
                WinstonModule.forRootAsync({
                    useClass: LoggerSettingsService,
                }),
            ],
        }).compile();

        service = module.get<CustomerLoyaltyService>(CustomerLoyaltyService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
