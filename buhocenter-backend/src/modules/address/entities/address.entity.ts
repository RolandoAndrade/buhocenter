import { Entity,Column,ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Customer } from '../../users/entities/customer.entity';
import { Status } from '../../status/entities/status.entity';

@Entity({ name: 'direction' })
export class Address extends BaseEntity {
	
	@Column({ name: 'first_street', type: 'text', nullable: false })
	firstStreet: string;

	@Column({ name: 'second_street', type: 'text', nullable: true })
	secondStreet: string;

    @Column({ name: 'city', type: 'text', nullable: false })
    city: string;
      
    @Column({ name: 'state', type: 'text', nullable: false })
    state: string;

    @Column({ name: 'zip_code', type: 'text', nullable: false })
	zipcode: number;
	
	@Column({ name: 'default_direction', type: 'boolean', nullable: true })
	setDefault: boolean;

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer, customer => customer.addresses)
	customer: Customer

	@JoinColumn({ name: 'status_id' })
	@ManyToOne(type => Status , status => status.addresses)
	status: Status;
}
