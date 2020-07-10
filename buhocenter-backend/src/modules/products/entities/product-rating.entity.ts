import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'product_ratings' })
export class ProductRating extends PrimalEntity {
    @Column({ name: 'rating', type: 'integer', nullable: true })
    rating: number;

    @Column({ name: 'comment', type: 'text', nullable: true })
    comment: string;

    @Column({ name: 'date', nullable: true })
    date: Date;

    @JoinColumn({ name: 'product_id' })
    @ManyToOne(
        type => Product,
        product => product.productRatings,
        { nullable: false },
    )
    product: Product;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(
        type => User,
        user => user.productRatings,
        { nullable: false },
    )
    user: User;
}
