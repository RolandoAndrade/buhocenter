import { Injectable, HttpService, Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { map } from 'rxjs/operators';
import { ProxyService } from "../services/proxy.service";

@Injectable()
export class PaymentGatewayRepository {

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly httpService: HttpService,
        private readonly proxyService: ProxyService,
    ) {}

    private createHeader() {
        const headers = {
            "content-type": "application/vnd.api+json",
            authorization: "Bearer " + process.env.UTRUST_API_KEY,
        };

        return headers;
    }

    async createOrder(order) {
        
        if (!this.proxyService.url) {
            await this.proxyService.connect();
        }

        this.logger.debug(`ngrok tunnel ${this.proxyService.url}`);

        this.logger.debug(`utrust endpoint ${process.env.UTRUST_ENDPOINT}`);

        // console.log('order.line_items', order.line_items);

        return await this.httpService.post(
            `${process.env.UTRUST_ENDPOINT}/stores/orders`, JSON.stringify(
                {
                    data: {
                        type: 'orders',
                        attributes: {
                            order: {
                                reference: `${order.id}`,
                                amount: order.amount,
                                return_urls: {
                                    return_url: `${this.proxyService.url}${process.env.API_PREFIX}${process.env.UTRUST_RETURN_URL}`,
                                    cancel_url: `${this.proxyService.url}${process.env.API_PREFIX}${process.env.UTRUST_CANCEL_URL}`,
                                    callback_url: `${this.proxyService.url}${process.env.API_PREFIX}${process.env.UTRUST_CALLBACK_URL}`,
                                },
                                line_items: order.line_items,
                            },
                            customer: order.customer,
                        },
                    }
                }    
            ), { headers: this.createHeader() }
        ).pipe(map(response => response.data)).toPromise();
    }
}