import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { Logger } from 'winston';

@Injectable()
export class EmailsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly sendGrid: SendGridService,
    ) {}

    /**
     * Send the welcome email to user
     * @param to string
     * @param name string
     * @returns Promise<void>
     */
    public async sendEmailWelcome(to: string, name: string): Promise<void> {
        this.logger.debug(`sendEmailWelcome: sending email... [to=${to}|userName=${name}]`, {
            context: EmailsService.name,
        });

        await this.sendGrid.send({
            to,
            from: process.env.MAIL_AUTH_USERNAME,
            subject: 'Welcome to Buhocenter',
            templateId: process.env.MAIL_TEMPLATE_ID_WELCOME,
            // @ts-ignore
            dynamic_template_data: {
                name: name,
            },
        });

        this.logger.debug(`sendEmailWelcome: email sent! [to=${to}]`, {
            context: EmailsService.name,
        });
    }
}
