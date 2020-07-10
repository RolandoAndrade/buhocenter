import { ConfigService } from '../../../config/config.service';
import { ConfigKeys } from '../../../config/config.keys';
import { testClient } from 'node_modules/coingate-v2';
import { IPaymentClient } from '../interfaces/payment-client';
import { BLOCKCHAIN_MODE, URL, TITLE, CURRENCY } from '../../../config/constants';

export class CoingatePaymentStrategy implements IPaymentClient {
    private _client: any;
    private _callbackURL: string;
    private _cancelURL: string;
    private _successURL: string;

    constructor(configService: ConfigService) {
        if (configService.get(ConfigKeys.BLOCKCHAIN_MODE) === BLOCKCHAIN_MODE.TEST) {
            this._client = testClient(configService.get(ConfigKeys.COINGATE_API_KEY));
        }
        this._callbackURL = `${configService.get(ConfigKeys.PRODUCTION_URL)}${URL.CALLBACK}`;
        this._cancelURL = `${configService.get(ConfigKeys.COINGATE_URL_CANCEL)}`;
        this._successURL = `${configService.get(ConfigKeys.COINGATE_URL_SUCCESS)}`;
    }

    async createOrder(orderId: number, price: number) {
        return await this._client.createOrder({
            order_id: `${orderId}`,
            price_amount: price,
            price_currency: CURRENCY.PRICE,
            receive_currency: CURRENCY.RECEIVE,
            title: TITLE.PAYMENT,
            description: '',
            callback_url: this._callbackURL,
            cancel_url: this._cancelURL,
            success_url: this._successURL,
        });
    }
}
