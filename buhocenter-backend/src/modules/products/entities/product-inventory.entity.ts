import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'product_inventories' })
export class ProductInventory extends PrimalEntity {
    @Column({ name: 'quantity_available', type: 'integer', nullable: false })
    availableQuantity: number;

    @Column({
        name: 'minimum_quantity_available',
        type: 'integer',
        nullable: true,
    })
    minimumAvailableQuantity: number;

    @JoinColumn({ name: 'product_id' })
    @OneToOne(
        type => Product,
        product => product.productInventory,
        { nullable: false, onUpdate: 'CASCADE' },
    )
    product: Product;
}
