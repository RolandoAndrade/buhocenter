import {Inject, Injectable} from '@nestjs/common';
import {WINSTON_MODULE_PROVIDER} from 'nest-winston';
import {Logger} from 'winston';
import {LanguageRepository} from '../repositories/language.repository';
import {SUCCESS} from '../../../config/constants';

@Injectable()
export class LanguagesService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly languageRepository: LanguageRepository,
    ) {}

    async getAllLanguages(): Promise<Response> {
        try {
            this.logger.debug(
                `getAllLanguages: Implementando peticion a poeditor para obtener lenguajes`,
                { context: LanguagesService.name },
            );
            return await this.languageRepository.getLanguages();
        } catch (e) {
            this.logger.error(
                `getAllLanguages: catch error: ${e.messages}`,
                { context: LanguagesService.name },
            );
            return Response.error();
        }
    }

    async getTermsLanguage(code: string): Promise<Response> {
        try {
            this.logger.debug(
                `getTermsLanguage: Implementando peticion a poeditor para obtener terminos del lenguaje`,
                { context: LanguagesService.name },
            );
            const responseTerms: any = await this.languageRepository.getTermsLanguage(code);
            if (responseTerms.response.status === SUCCESS) {
                return this.destructureResponseTerms(responseTerms.result.terms);
            }
            return Response.error();
        } catch (e) {
            this.logger.error(
                `getTermsLanguage: catch error: ${e.messages}`,
                { context: LanguagesService.name },
            );
            return Response.error();
        }
    }

    destructureResponseTerms(terms: any): any {
        const termsLanguages: any = {};
        terms.map(term => {
            termsLanguages[term.term] = term.translation.content;
        });
        return termsLanguages;
    }
}
