import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from './product.entity';
import { Status } from '../../status/entities/status.entity';

@Entity('offers')
export class Offer extends PrimalEntity {
    @Column({ name: 'name', type: 'text', nullable: true })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'percentage', type: 'decimal', nullable: true })
    percentage: number;

    @OneToMany(
        type => Product,
        products => products.offer,
    )
    products: Product[];

    @JoinColumn({ name: 'status_id' })
    @ManyToOne(
        type => Status,
        status => status.statusOffers,
        { nullable: false },
    )
    status: Status;
}
