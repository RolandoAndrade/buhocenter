import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Status } from './status.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity({ name: 'status_histories' })
export class StatusHistory extends PrimalEntity {
    @JoinColumn({ name: 'payment_id' })
    @ManyToOne(
        type => Payment,
        payment => payment.statusHistories,
        { nullable: false },
    )
    payment: Payment;

    @JoinColumn({ name: 'status_id' })
    @ManyToOne(
        type => Status,
        status => status.statusHistories,
        { nullable: false },
    )
    status: Status;
}
