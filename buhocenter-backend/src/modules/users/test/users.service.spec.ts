import { UsersService } from '../services/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionInterface, repositoryMockFactory } from '../../../../test/mock.functions';
import { WinstonModule } from 'nest-winston';
import { LoggerSettingsService } from '../../settings/services/logger.service';
import { User } from '../entities/user.entity';
import { userMockDB } from './mocks/user.mock';
import { LanguagesService } from '../services/languages.service';
import { LanguageRepository } from '../repositories/language.repository';
import { SendGridModule, SendGridService } from '@anchan828/nest-sendgrid';
import { AuthService } from '../../auth/services/auth.service';
import { forwardRef, HttpModule, HttpService } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { NotificationsModule } from '../../notifications/notifications.module';

xdescribe('user service', () => {
    let service: UsersService;
    let userRepository: MockFunctionInterface;
    beforeEach(async () => {
        process.env.JWT_SECRET = 'key4test';
        process.env.JWT_EXPIRES_IN = '60s';
        process.env.SENDGRID_API_KEY = 'SG.NONE';
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                LanguagesService,
                LanguageRepository,
                AuthService,
                JwtStrategy,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
            imports: [
                PassportModule,
                NotificationsModule,
                JwtModule.registerAsync({
                    useFactory: async () => ({
                        secret: process.env.JWT_SECRET,
                        signOptions: {
                            expiresIn: process.env.JWT_EXPIRES_IN,
                        },
                    }),
                }),
                SendGridModule.forRoot({
                    apikey: process.env.SENDGRID_API_KEY,
                }),
                HttpModule,
                WinstonModule.forRootAsync({
                    useClass: LoggerSettingsService,
                }),
            ],
        }).compile();
        service = module.get(UsersService);
        userRepository = module.get(getRepositoryToken(User));
    });

    describe('get user by user id', () => {
        it('must return the user', async () => {
            userRepository.findOne.mockResolvedValue(userMockDB[0]);
            const r = await service.getUserByUuid('1');
            expect(r.id).toEqual(1);
        });
    });
});
