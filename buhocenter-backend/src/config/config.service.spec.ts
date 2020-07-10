import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { ConfigKeys } from './config.keys';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService],
        }).compile();

        service = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Obtener claves', () => {
        expect(service.get(ConfigKeys.API_PORT)).toBe('3000');
        expect(service.get(ConfigKeys.HOST)).toBe('localhost');
    });
});
