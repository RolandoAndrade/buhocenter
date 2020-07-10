import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'product_questions' })
export class ProductQuestion extends PrimalEntity {
    @Column({ name: 'comment', type: 'text', nullable: false })
    comment: string;

    @JoinColumn({ name: 'product_id' })
    @ManyToOne(
        type => Product,
        product => product.productQuestions,
        { nullable: false },
    )
    product: Product;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(
        type => User,
        user => user.productQuestions,
        { nullable: false },
    )
    user: User;
}
