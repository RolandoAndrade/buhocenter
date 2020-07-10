import { Entity, Column, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Cart } from '../../carts/entities/cart.entity';
import { StatusHistory } from './status-history.entity';
import { Product } from '../../products/entities/product.entity';
import { Address } from '../../address/entities/address.entity';
import { User } from '../../users/entities/user.entity';
import { Commission } from '../../payments/entities/commission.entity';
import { Offer } from '../../products/entities/offer.entity';
import { Catalogue } from '../../products/entities/catalogue.entity';

@Entity('statuses')
export class Status extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({
        name: 'description',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    description: string;

    @OneToMany(
        type => User,
        users => users.status,
    )
    users: User[];

    @OneToMany(
        type => Address,
        addresses => addresses.status,
    )
    addresses: Address[];

    @OneToMany(
        type => Cart,
        carts => carts.status,
    )
    carts: Cart[];

    @OneToMany(
        type => Product,
        products => products.status,
    )
    products: Product[];

    @OneToMany(
        type => Commission,
        commissions => commissions.status,
    )
    commissions: Product[];

    @OneToMany(
        type => StatusHistory,
        statusHistories => statusHistories.status,
    )
    statusHistories: StatusHistory[];

    @OneToMany(
        type => Offer,
        statusOffers => statusOffers.status,
    )
    statusOffers: Offer[];

    @OneToMany(
        type => Catalogue,
        catalogues => catalogues.status,
    )
    catalogues: Catalogue[];
}
