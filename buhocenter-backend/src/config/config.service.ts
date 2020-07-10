import * as fs from 'fs';
import { parse } from 'dotenv';
import { logger } from '@anchan828/nest-sendgrid/dist/sendgrid.logger';

export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
        const isProductionEnvironment = process.env.NODE_ENV === 'production';

        if (isDevelopmentEnvironment || !process.env.NODE_ENV) {
            const envFilePath = __dirname + '/../../.env';
            const exist = fs.existsSync(envFilePath);
            if (exist) {
                this.envConfig = parse(fs.readFileSync(envFilePath));
            } else {
                logger.log('No se ha encontrado el archivo dot env', 'ConfigService');
            }
        } else if (isProductionEnvironment) {
            const envFilePath = __dirname + '/../../.env';
            const exist = fs.existsSync(envFilePath);
            if (exist) {
                this.envConfig = parse(fs.readFileSync(envFilePath));
            } else {
                this.envConfig = {
                    PORT: process.env.PORT,
                    HOST: process.env.HOST,
                    USERNAME: process.env.USER,
                    PASSWORD: process.env.PASSWORD,
                    DATABASE: process.env.DATABASE,
                    SYNCHRONIZE: process.env.SYNCHRONIZE,
                    JWT_SECRET: process.env.JWT_SECRET,
                    SEND_GRID_API_KEY: process.env.SG_API_KEY,
                };
            }
        } else {
            const envFilePath = __dirname + '/../../.env.test';
            const exist = fs.existsSync(envFilePath);
            if (exist) {
                this.envConfig = parse(fs.readFileSync(envFilePath));
            } else {
                logger.log('No se ha encontrado el archivo .env.test', 'ConfigService');
                process.exit(0);
            }
        }
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}
