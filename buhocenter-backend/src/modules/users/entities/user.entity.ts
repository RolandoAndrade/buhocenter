import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Status } from '../../status/entities/status.entity';
import { Role } from './role.entity';
import { ProductRating } from '../../products/entities/product-rating.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { ProductQuestion } from '../../products/entities/product-question.entity';
import { Address } from '../../address/entities/address.entity';
import { ForeignExchange } from './foreign-exchange.entity';

@Entity({ name: 'users' })
export class User extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({
        name: 'last_name',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    lastName: string;

    @Column({ name: 'birthdate', nullable: true })
    birthdate: Date;

    @Column({ name: 'email', type: 'varchar', length: 100, nullable: false })
    email: string;

    @Column({ name: 'cellphone', type: 'varchar', length: 20, nullable: true })
    cellphone: string;

    @Column({ name: 'is_federate', type: 'boolean', nullable: false })
    is_federate: boolean;

    @Column({ name: 'loyalty_system_token', type: 'text', nullable: true })
    loyaltySystemToken: string;

    @Column({ name: 'uid', type: 'text', nullable: true })
    uid: string;

    @Column({ name: 'token', type: 'varchar', length: 200, nullable: true })
    token: string;

    @Column({ name: 'language_id', type: 'varchar', length: 4, nullable: true })
    language: string;

    @Column({ name: 'fidelity_user_email', type: 'text', nullable: true })
    fidelityUserEmail: string;

    @Column({ name: 'status_id', type: 'int', default: 1 })
    @JoinColumn({ name: 'status_id' })
    @ManyToOne(
        type => Status,
        status => status.users,
        { nullable: false },
    )
    status: Status;

    @JoinColumn({ name: 'role_id' })
    @ManyToOne(
        type => Role,
        role => role.user,
        { nullable: false },
    )
    role: Role;

    @JoinColumn({ name: 'foreign_exchange_id' })
    @Column({ name: 'foreign_exchange_id', type: 'int', default: 1 })
    @ManyToOne(
        type => ForeignExchange,
        foreignExchange => foreignExchange.users,
        { nullable: false },
    )
    foreignExchange: ForeignExchange;

    @OneToMany(
        type => Address,
        addresses => addresses.user,
        { cascade: true },
    )
    addresses: Address[];

    @OneToMany(
        type => ProductRating,
        productRatings => productRatings.user,
    )
    productRatings: ProductRating[];

    @OneToMany(
        type => ProductQuestion,
        productQuestions => productQuestions.user,
    )
    productQuestions: ProductQuestion[];

    @OneToMany(
        type => Cart,
        carts => carts.user,
    )
    carts: Cart[];
}
