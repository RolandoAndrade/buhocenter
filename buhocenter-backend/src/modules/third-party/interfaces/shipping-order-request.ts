import { ShippingOrderItems } from './shipping-order-items.interface';

export interface ShippingOrderRequest {
    commercial_ally_api_key: string;
    Warehouse_id: number;
    rec_first_name: string;
    rec_last_name: string;
    rec_email: string;
    rec_phone_number: string;
    destination_address: string;
    items: ShippingOrderItems[];
}
