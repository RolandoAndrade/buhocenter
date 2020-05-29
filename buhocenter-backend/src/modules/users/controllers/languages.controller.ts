import {Controller, Get, Res, HttpStatus, Post, Inject, Param} from '@nestjs/common';
import {LanguagesService} from '../services/languages.service';
import {WINSTON_MODULE_PROVIDER} from 'nest-winston';
import {Logger} from 'winston';

@Controller('languages')
export class LanguagesController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly languageService: LanguagesService,
    ) {}

    @Get()
    async getAll(@Res() res): Promise<Response> {
        try {
            this.logger.debug(
                `getAll: Obteniendo lenguajes poeditor`,
                { context: LanguagesController.name },
            );
            const dataResponse: Response = await this.languageService.getAllLanguages();
            return res.status(HttpStatus.OK).send(dataResponse);
        } catch (e) {
            this.logger.debug(
                `getAll: catch error  ${e.message}`,
                { context: LanguagesController.name },
            );
            return res.status(HttpStatus.NOT_FOUND).send({messages: 'Catch error'});
        }
    }

    @Get('/terms/:code')
    async getTermsLanguage(@Res() res, @Param('code') code: string ): Promise<Response> {
        try {
            this.logger.debug(
                `getTermsLanguage: Obteniendo terminos del lenguaje:  [${code}]`,
                { context: LanguagesController.name },
            );
            const dataResponse: any = await this.languageService.getTermsLanguage(code);
            return res.status(HttpStatus.OK).send({ [code]: dataResponse});
        } catch (e) {
            this.logger.debug(
                `getTermsLanguage: catch error  ${e.message}`,
                { context: LanguagesController.name },
            );
            return res.status(HttpStatus.NOT_FOUND).send({messages: 'Catch error'});
        }
    }

}
