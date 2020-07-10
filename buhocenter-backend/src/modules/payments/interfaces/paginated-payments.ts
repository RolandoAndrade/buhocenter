import { Payment } from '../entities/payment.entity';

export interface PaginatedPayments {
    payments: Payment[];
    paymentsNumber: number;
}
