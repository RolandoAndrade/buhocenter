import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Offer } from './offer.entity';
import { Product } from './product.entity';

@Entity('product_offer')
export class productOffer extends BaseEntity {
	
	@Column({ name: 'discount_price', type: 'decimal', nullable: false })
	discountPrice: number;
	
	@Column({ name: 'percentage', type: 'decimal', nullable: true })
	percentage: number;

	@JoinColumn({ name: 'offer_id' })
	@ManyToOne(type => Offer, offer => offer.productOffers)
	offer: Offer;

	@JoinColumn({ name: 'product_id' })
	@ManyToOne(type => Product, product => product.offers)
	product: Product;
}
