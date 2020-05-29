import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Service } from './service.entity';
import { Customer } from '../../users/entities/customer.entity';

@Entity({ name: 'service_rating' }) 
export class ServiceRating extends BaseEntity {
	
	@Column({ name: 'rating', type: 'integer', nullable: false })
	rating: number;

	@Column({ name: 'comment', type: 'varchar', length: 500, nullable: true })
	comment: string;

	@Column({ name: 'date', nullable: false })
	date: Date;	

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer, customer => customer.serviceRatings)
	customer: Customer;

	@JoinColumn({ name: 'service_id' })
	@ManyToOne(type => Service, service => service.serviceRatings)
	service: Service;
}
