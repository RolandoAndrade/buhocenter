export interface NewOrder {
    id: number;
    status: string;
    price_currency: string;
    price_amount: string;
    receive_currency: string;
    receive_amount: string;
    created_at: string;
    order_id: string;
    payment_url: string;
    token: string;
}
