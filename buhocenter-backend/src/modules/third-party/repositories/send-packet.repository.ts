import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ShippingOrderRequest } from '../interfaces/shipping-order-request';

@Injectable()
export class SendPacketRepository {
    constructor(private readonly httpService: HttpService) {}

    public async GetPacketShippingPrice(shippingData: ShippingOrderRequest): Promise<any> {
        return await this.httpService
            .post(`${process.env.SHIPTHIS_BASE_URL}/calculate-pickup`, shippingData)
            .pipe(map(response => response.data))
            .toPromise();
    }

    public async createShippingPackage(shippingData: ShippingOrderRequest): Promise<any> {
        return await this.httpService
            .post(`${process.env.SHIPTHIS_BASE_URL}/create-pickup`, shippingData)
            .pipe(map(response => response.data))
            .toPromise();
    }
}
