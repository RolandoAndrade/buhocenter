import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './modules/app/app.module';
import { join } from 'path';
import * as rTracer from 'cls-rtracer';
import * as helmet from 'helmet';
import * as express from 'express';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // app.use(express.static(join('./templates')));

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.enableCors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'DELETE', 'POST'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    });

    app.use(rTracer.expressMiddleware());
    app.use(helmet());

    app.setGlobalPrefix('/api/v1');

    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
