import { Entity, OneToMany, JoinColumn, ManyToOne, Column } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Payment } from './payment.entity';

@Entity('cryptocurrencies')
export class Cryptocurrency extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ name: 'iso', type: 'varchar', nullable: false })
    iso: string;

    @OneToMany(
        type => Payment,
        payments => payments.cryptocurrency,
    )
    payments: Payment[];
}
