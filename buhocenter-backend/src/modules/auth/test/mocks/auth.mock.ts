import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { AuthService } from '../../services/auth.service';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { LoggerSettingsService } from '../../../settings/services/logger.service';

export const authMockModuleMetadata: ModuleMetadata = {
    providers: [AuthService, JwtStrategy],
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                },
            }),
        }),
        WinstonModule.forRootAsync({
            useClass: LoggerSettingsService,
        }),
    ],
    exports: [AuthService],
};
