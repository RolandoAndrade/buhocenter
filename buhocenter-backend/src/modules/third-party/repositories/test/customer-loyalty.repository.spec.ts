import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerSettingsService } from '../../../settings/services/logger.service';
import { ReadStream } from 'fs';
import { sendMock } from '../../../documents/infraestructure/test/mocks/send.mock';
import { ConfigModule } from '../../../../config/config.module';
import { PetromilesClientsCsv } from '../../../documents/infraestructure/csv/petromiles-clients.csv';
import { CustomerLoyaltyRepository } from '../customer-loyalty.repository';

describe('customer loyalty repository', () => {
    let petromiles: CustomerLoyaltyRepository;
    let file: ReadStream;
    beforeAll(() => {
        file = new PetromilesClientsCsv().generate(sendMock);
    });
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CustomerLoyaltyRepository],
            imports: [
                ConfigModule,
                HttpModule,
                WinstonModule.forRootAsync({
                    useClass: LoggerSettingsService,
                }),
            ],
        }).compile();
        petromiles = module.get(CustomerLoyaltyRepository);
    });

    describe('should create a file in the petromiles server', () => {
        xit('send a csv to server', async () => {
            const response = await petromiles.sendClientsCsv(file);
            expect(response).toBeDefined();
        });
    });
});
