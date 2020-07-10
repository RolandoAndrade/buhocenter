import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { User } from '../../users/entities/user.entity';
import { Status } from '../../status/entities/status.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity({ name: 'addresses' })
export class Address extends PrimalEntity {
    @Column({ name: 'first_street', type: 'text', nullable: false })
    firstStreet: string;

    @Column({ name: 'second_street', type: 'text', nullable: true })
    secondStreet: string;

    @Column({ name: 'city', type: 'text', nullable: false })
    city: string;

    @Column({ name: 'state', type: 'text', nullable: false })
    state: string;

    @Column({ name: 'zip_code', type: 'text', nullable: false })
    zipcode: number;

    @Column({ name: 'default_address', type: 'boolean', nullable: true })
    setDefault: boolean;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(
        type => User,
        user => user.addresses,
        { nullable: false, onUpdate: 'CASCADE' },
    )
    user: User;

    @JoinColumn({ name: 'status_id' })
    @ManyToOne(
        type => Status,
        status => status.addresses,
        { nullable: false },
    )
    status: Status;

    @OneToMany(
        type => Payment,
        payments => payments.address,
    )
    payments: Payment[];
}
