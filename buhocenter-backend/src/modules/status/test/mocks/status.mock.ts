import { Status } from '../../entities/status.entity';
import { StatusHistory } from '../../entities/status-history.entity';
import { Payment } from '../../../payments/entities/payment.entity';

function createStatus(id: number, name: string, description: string): Status {
    return { id, name, description } as Status;
}

function createStatusHistory(payment: number, status: number): StatusHistory {
    return { payment: { id: payment }, status: { id: status } } as StatusHistory;
}

export const statusMockDB: Status[] = [
    createStatus(1, 'Active', 'Indicates that the resource is available to the system'),
    createStatus(2, 'Inactive', 'Indicates that the resource is not available to the system'),
    createStatus(3, 'In process', 'Indicates that the order is waiting for payment confirmation'),
    createStatus(
        4,
        'Processed',
        'Indicates that the order has been confirmed and your payment has been approved.',
    ),
    createStatus(5, 'Rejected', 'Indicates that the order cannot be processed'),
    createStatus(6, 'Reserved', 'Indicates that the quantity of the product is reserved'),
];
