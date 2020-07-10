import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Status } from '../../status/entities/status.entity';
import { Product } from '../../products/entities/product.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('carts')
export class Cart extends PrimalEntity {
    @Column({ name: 'quantity', type: 'integer', nullable: false })
    quantity: number;

    @Column({ name: 'product_price', type: 'decimal', nullable: false })
    productPrice: number;

    @Column({ name: 'product_points', type: 'integer', nullable: true })
    productPoints: number;

    @Column({ name: 'offer_price', type: 'decimal', nullable: true })
    offerPrice: number;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(
        type => User,
        user => user.carts,
        { nullable: false },
    )
    user: User;

    @JoinColumn({ name: 'status_id' })
    @ManyToOne(
        type => Status,
        status => status.carts,
        { nullable: false },
    )
    status: Status;

    @JoinColumn({ name: 'payment_id' })
    @ManyToOne(
        type => Payment,
        payment => payment.carts,
        { nullable: true, onUpdate: 'CASCADE' },
    )
    payment: Payment;

    @JoinColumn({ name: 'product_id' })
    @ManyToOne(
        type => Product,
        product => product.carts,
        { nullable: false },
    )
    product: Product;
}
