import { HttpService, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { map } from 'rxjs/operators';

@Injectable()
export class LanguageRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly httpService: HttpService,
    ) {}

    async getLanguages(): Promise<Response> {
        try {
            const headersRequest = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            const response = await this.httpService
                .post(
                    `https://poeditor.com/api/`,
                    `api_token=${process.env.POEDITOR_API_KEY}&id=${process.env.POEDITOR_PROJECT_ID}&action=list_languages`,
                    { headers: headersRequest },
                    // tslint:disable-next-line:no-shadowed-variable
                )
                .pipe(map(response => response.data))
                .toPromise();
            // tslint:disable-next-line:max-line-length
            this.logger.debug(
                `getLanguages: Lenguajes de poeditor obtenidos [response=${JSON.stringify(response)}]`,
                { context: LanguageRepository.name },
            );
            return response;
        } catch (e) {
            this.logger.error(`getLanguages: catch error [error=${e.message}]`, {
                context: LanguageRepository.name,
            });
            return Response.error();
        }
    }

    async getTermsLanguage(code: string): Promise<Response> {
        try {
            const headersRequest = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            const response = await this.httpService
                .post(
                    `https://api.poeditor.com/v2/terms/list`,
                    `api_token=${process.env.POEDITOR_API_KEY}&id=${process.env.POEDITOR_PROJECT_ID}&language=${code}`,
                    { headers: headersRequest },
                    // tslint:disable-next-line:no-shadowed-variable
                )
                .pipe(map(response => response.data))
                .toPromise();
            // tslint:disable-next-line:max-line-length
            this.logger.debug(`getTermsLanguage: Optenidos terminos [response=${JSON.stringify(response)}]`, {
                context: LanguageRepository.name,
            });

            return response;
        } catch (e) {
            this.logger.error(`getLanguages: catch error [error=${e.message}]`, {
                context: LanguageRepository.name,
            });
            return Response.error();
        }
    }
}
