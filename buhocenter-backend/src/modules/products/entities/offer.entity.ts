import { Entity, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { productOffer } from './product-offer.entity';
import { ServiceOffer } from '../../services/entities/service-offer.entity';
import { Status } from '../../status/entities/status.entity';


@Entity('oferta') 
export class Offer extends BaseEntity {
	
	@Column({ name: 'name', type: 'text', nullable: true })
	name: string;

	@Column({ name: 'description', type: 'text', nullable: true })
	description: string;

	@OneToMany(type => productOffer, productOffers => productOffers.offer)
	productOffers: productOffer[];

	@OneToMany(type => ServiceOffer, serviceOffers => serviceOffers.offer)
	serviceOffers: ServiceOffer[];

	@JoinColumn({ name: 'status_id' })
	@ManyToOne(type => Status, status => status.offers)
	status: Status;
}
