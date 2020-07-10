import { Entity, OneToMany, JoinColumn, ManyToOne, Column } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Status } from '../../status/entities/status.entity';
import { Payment } from './payment.entity';

@Entity('commissions')
export class Commission extends PrimalEntity {
    @Column({ name: 'service_fee', type: 'decimal', nullable: false })
    serviceFee: number;

    @Column({ name: 'processor_fee', type: 'decimal', nullable: false })
    processorFee: number;

    @JoinColumn({ name: 'status_id' })
    @ManyToOne(
        type => Status,
        status => status.commissions,
        { nullable: false },
    )
    status: Status;

    @OneToMany(
        type => Payment,
        payments => payments.commission,
    )
    payments: Payment[];
}
