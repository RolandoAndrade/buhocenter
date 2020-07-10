export interface IPaymentClient {
    createOrder(orderId: number, price: number): any;
}
