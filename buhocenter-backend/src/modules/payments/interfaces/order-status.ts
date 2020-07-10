export interface OrderStatus {
    id: number;
    order_id: string;
    status: string;
    price_amount: string;
    price_currency: string;
    receive_amount: string;
    receive_currency: string;
    pay_amount: string;
    pay_currency: string;
    created_at: string;
    token: string;
}
