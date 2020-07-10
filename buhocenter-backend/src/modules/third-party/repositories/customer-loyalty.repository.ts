import { HttpService, Inject, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CustomerLoyaltyAccumulatePoints } from '../interfaces/customer-loyalty-accumulate-points';
import { ConfigService } from '../../../config/config.service';

import { ConfigKeys } from '../../../config/config.keys';
import { ReadStream } from 'fs';
import {
    CustomerLoyaltyAssociateUser,
    CustomerLoyaltyAssociateUserResponse,
    CustomerLoyaltyAssociateUserCodeResponse,
} from '../interfaces/customer-loyalty-associate-user.interface';

@Injectable()
export class CustomerLoyaltyRepository {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    async accumulatePoints(
        accumulatePointsRequest: CustomerLoyaltyAccumulatePoints,
        token: string,
    ): Promise<any> {
        this.logger.debug(
            `accumulatePoints: fetching product points in PetroMiles...[route=${this.configService.get(
                ConfigKeys.PETROMILES_URL,
            )}third-party-clients/add-points], accumulatePointsRequest = ${JSON.stringify(
                accumulatePointsRequest,
            )}]`,
            {
                context: CustomerLoyaltyRepository.name,
            },
        );

        return await this.httpService
            .post(
                `${this.configService.get(ConfigKeys.PETROMILES_URL)}third-party-clients/add-points`,
                accumulatePointsRequest,
                {
                    headers: {
                        authorization: 'Bearer ' + token,
                    },
                },
            )
            .pipe(map(response => response.data))
            .toPromise();
    }

    public async authorize(
        associateUserRequest: CustomerLoyaltyAssociateUser,
    ): Promise<CustomerLoyaltyAssociateUserResponse> {
        this.logger.debug(`authorize: authorizing user in PetroMiles...`, {
            context: CustomerLoyaltyRepository.name,
        });

        return await this.httpService
            .post(
                `${this.configService.get(ConfigKeys.PETROMILES_URL)}third-party-clients/associate-user-code`,
                associateUserRequest,
            )
            .pipe(map(response => response.data))
            .toPromise();
    }

    async authorizeCode(
        accumulatePointsRequest: CustomerLoyaltyAssociateUser,
    ): Promise<CustomerLoyaltyAssociateUserCodeResponse> {
        this.logger.debug(`authorizeCode: validating user code in PetroMiles...`, {
            context: CustomerLoyaltyRepository.name,
        });

        return await this.httpService
            .post(
                `${this.configService.get(
                    ConfigKeys.PETROMILES_URL,
                )}third-party-clients/associate-user-token`,
                accumulatePointsRequest,
            )
            .pipe(map(response => response.data))
            .toPromise();
    }

    async sendClientsCsv(csvFile: ReadStream): Promise<Response> {
        this.logger.info(
            `sendUsersCsv: sending csv file [route=${this.configService.get(
                ConfigKeys.PETROMILES_URL,
            )}third-party-clients/csv-check]`,
        );
        const formData = require('form-data');
        const form = new formData();
        form.append('apiKey', this.configService.get(ConfigKeys.PETROMILES_API_KEY));
        form.append('file', csvFile);

        const result = await this.httpService
            .post(`${this.configService.get(ConfigKeys.PETROMILES_URL)}third-party-clients/csv-check`, form, {
                headers: {
                    'content-type': `multipart/form-data; boundary=${form.getBoundary()}`,
                },
            })
            .pipe(map(i => i.data))
            .toPromise();

        this.logger.debug(`sendUsersCsv: file was sent [response=${JSON.stringify(result)}]`, {
            context: CustomerLoyaltyRepository.name,
        });

        return result;
    }
}
