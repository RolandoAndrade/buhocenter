import { Controller, Get, Res, Param, ParseIntPipe, HttpStatus, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ServicesService } from '../services/services.service';
import { Logger } from 'winston';
import { Service } from '../entities/service.entity';
import { Response } from 'express';

@Controller('services')
export class ServicesController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly servicesService: ServicesService,
    ) {}

    @Get(':id')
	async getServiceById(
		@Res() res: Response,
        @Param('id', new ParseIntPipe()) id: number,
	): Promise<Response> {
        this.logger.info(`getServiceById: obteniendo el service por id [id=${id}]`, { context: ServicesController.name });

        try {
            const service: Service = await this.servicesService.getServiceById(id);
            return res.status(HttpStatus.OK).send(service);
        } catch (e) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }
	}
}
