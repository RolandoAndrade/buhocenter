import { HttpService, Inject } from '@nestjs/common'
import { map } from 'rxjs/operators';
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

export class AddressHttpRepository  {
    constructor(
        private http: HttpService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    private static readonly RESOURCE = `${process.env.DIRECTION_VERIFICATION_URL}`;

    private createUri(
        path: string[],
        queryString?: Object | any
    ): string {
    let uri: string = '';

        if (path) {
            uri +=  path.join('/');
        }

        if (queryString) {
            uri += '?';
            const query: string[] = [];

                for (const [key, value] of Object.entries(queryString)) {
                    query.push(`${key}=${value}`);
                }

            uri += query.join('&');
        }

        console.log('uri', uri)

        return uri;
    }

         
    /**
    * Validates the provided address with SmartyStreets
    * @param addressDetail address to validate in SmartyStreets
    * @param serviceKey credentials to use SmartyStreets and validate address
    */
    async postAddressUri(addressDetail, serviceKey: any): Promise<any> {          
        let route = this.createUri([`${AddressHttpRepository.RESOURCE}`])
        return await this.http.post(`${process.env.DIRECTION_VERIFICATION_URL}?auth-id=${process.env.SMARTSTREET_AUTH_KEY}&auth-token=${process.env.SMARTSTREET_AUTH_TOKEN}`, [addressDetail]).pipe(map(response => response.data)).toPromise();       
    }
}
