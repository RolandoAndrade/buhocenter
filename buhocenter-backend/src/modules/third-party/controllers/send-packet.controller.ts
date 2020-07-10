import { Controller, Post, Body, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SendPacketService } from '../services/send-packet.service';

@Controller('send-packet')
export class SendPacketController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly sendPacketService: SendPacketService,
    ) {}

    @Post()
    async sendPacket(@Body() shippingData: any): Promise<any> {
        this.logger.info(`sendPacket: sending package... [shippingData=${JSON.stringify(shippingData)}]`, {
            context: SendPacketController.name,
        });

        return await this.sendPacketService.sendPacket(shippingData);
    }
}
