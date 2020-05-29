import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Status } from '../../status/entities/status.entity';
import { ServiceCart } from '../../carts/entities/service-cart.entity'
import { ServiceCatalogue } from './service-catalogue.entity';
import { ServiceCategory } from './service-category.entity';
import { ServiceOffer } from './service-offer.entity';
import { ServiceQuestion } from './service-question.entity';
import { ServiceRating } from './service-rating.entity';
import { ServicePhoto } from './service-photo.entity';
import { ServiceProvider } from './service-provider.entity';

@Entity({ name: 'service' })
export class Service extends BaseEntity {
	@Column({ name: 'name', type: 'text', nullable: false })
	name: string;

	@Column({ name: 'description', type: 'text', nullable: false })
	description: string;

	@Column({ name: 'price', type: 'decimal', nullable: false })
	price: number;

	@JoinColumn({ name: 'status_id' })
	@ManyToOne(type => Status, status => status.services)
	status: Status;

	@OneToMany(type => ServiceProvider, serviceProvider => serviceProvider.services)
	serviceProvider: ServiceProvider;

	@OneToMany(type => ServiceCart, serviceCarts => serviceCarts.cart)
	serviceCarts: ServiceCart[];

	@OneToMany(type => ServiceRating, serviceRatings => serviceRatings.service)
	serviceRatings: ServiceRating[];

	@OneToMany(type => ServiceQuestion, question => question.service)
	questions: ServiceQuestion[];

	@OneToMany(type => ServiceCategory, serviceCategories => serviceCategories.service)
	serviceCategories: ServiceCategory[];

	@OneToMany(type => ServiceOffer, offers => offers.service)
	offers: ServiceOffer[];

	@OneToMany(type => ServicePhoto, photos => photos.service)
	photos: ServicePhoto[];
}