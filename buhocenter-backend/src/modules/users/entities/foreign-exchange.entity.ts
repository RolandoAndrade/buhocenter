import { Entity, Column, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Payment } from '../../payments/entities/payment.entity';
import { User } from './user.entity';

@Entity({ name: 'foreign_exchanges' })
export class ForeignExchange extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ name: 'symbol', type: 'text', nullable: false })
    symbol: string;

    @Column({ name: 'exchange', type: 'decimal', nullable: false })
    exchange: number;

    @Column({ name: 'iso', type: 'varchar', length: 100, nullable: false })
    iso: string;

    @OneToMany(
        type => User,
        users => users.foreignExchange,
    )
    users: User[];

    @OneToMany(
        type => Payment,
        payments => payments.foreignExchange,
    )
    payments: Payment[];
}
