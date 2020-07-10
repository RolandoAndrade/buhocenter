import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { ConfigKeys } from 'src/config/config.keys';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        async useFactory(configService: ConfigService) {
            return {
                // ssl: true,
                // extra: {
                //     ssl: {
                //         rejectUnauthorized: false,
                //     },
                // },
                type: 'postgres' as 'postgres',
                host: configService.get(ConfigKeys.HOST),
                database: configService.get(ConfigKeys.DATABASE),
                username: configService.get(ConfigKeys.USERNAME),
                password: configService.get(ConfigKeys.PASSWORD),
                port: parseInt(configService.get(ConfigKeys.DATABASE_PORT)),
                synchronize: Boolean(configService.get(ConfigKeys.SYNCHRONIZE)),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
            } as ConnectionOptions;
        },
    }),
];
