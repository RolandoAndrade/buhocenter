import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { PlatformParameter } from './platform-parameter.entity';
import { Customer } from '../../users/entities/customer.entity';
import { Status } from '../../status/entities/status.entity';

@Entity({ name: 'platform' })
export class Platform extends BaseEntity {
	
	@Column({ name: 'content', type: 'varchar', length: 100, nullable: false })
	content: string;

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer, customer => customer.platforms)
	customer: Customer;

	@JoinColumn({ name: 'platform_parameter_id' })
	@ManyToOne(type => PlatformParameter, platformParameter => platformParameter.platforms)
	platformParameter: PlatformParameter;

	@JoinColumn({ name: 'status_id' })
	@ManyToOne(type => Status, status => status.platforms)
	status: Status;
}
