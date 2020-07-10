import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class AddressValidationRepository {
    constructor(private readonly httpService: HttpService) {}

    /**
     * Validates the provided address with SmartyStreets
     * @param address address to validate in SmartyStreets
     */
    async postAddressUri(address): Promise<any> {
        return await this.httpService
            .post(
                `${process.env.DIRECTION_VERIFICATION_URL}?auth-id=${process.env.SMARTSTREET_AUTH_KEY}&auth-token=${process.env.SMARTSTREET_AUTH_TOKEN}`,
                [address],
            )
            .pipe(map(response => response.data))
            .toPromise();
    }
}
