import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Injectable,
    Inject,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Console } from 'console';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(
            `ERROR: ${status}|PATH: ${request.url}|NAME: ${exception['name']}|MESSAGE: ${exception['message'].message}|EXCEPTION: ${exception}`,
            {
                context: AllExceptionsFilter.name,
            },
        );

        response.status(status).json({
            statusCode: status,
            message: exception['message'] || 'unknown',
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
