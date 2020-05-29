export class PaymentOrderDto {
    event_type: string;
    resource: {
        amount: string;
        currency: string;
        reference: string;
    };
    signature: string;
    state: string;
}