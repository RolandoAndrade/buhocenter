import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Service } from './service.entity';
import { Customer } from '../../users/entities/customer.entity';

@Entity({ name: 'service_question' }) 
export class ServiceQuestion extends BaseEntity {
	
	@Column({ name: 'description', type: 'varchar', length: 100, nullable: true })
	description: string;

	@Column({ name: 'date', nullable: false})
	date: Date;	

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer , customer => customer.serviceQuestions)
	customer: Customer;

	@JoinColumn({ name: 'service_id' })
	@ManyToOne(type => Service, service => service.questions)
	service: Service;
}
