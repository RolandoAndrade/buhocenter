import { NewOrder } from './new-order';
import { Payment } from '../entities/payment.entity';

export interface NewPayment {
    payment: Payment;
    order: NewOrder;
    packageOrder: any;
}
