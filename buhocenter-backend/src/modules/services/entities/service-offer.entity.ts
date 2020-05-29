import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Service } from './service.entity';
import { Offer } from '../../products/entities/offer.entity';

@Entity({ name: 'service_offer' }) 
export class ServiceOffer extends BaseEntity {
	
	@Column({ name: 'discount_price', type: 'decimal', nullable: false })
	discountPrice: number;

	@Column({ name: 'percentage', type: 'decimal', nullable: true })
	percentage: number;

	@JoinColumn({ name: 'service_id' })
	@ManyToOne(type => Service, service => service.offers)
	service: Service;

	@JoinColumn({ name: 'offer_id' })
	@ManyToOne(type => Offer, offer => offer.serviceOffers)
	offer: Offer;
}