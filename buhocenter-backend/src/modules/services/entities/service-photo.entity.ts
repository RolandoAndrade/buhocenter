import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Service } from './service.entity';

@Entity({ name: 'service_photo' }) 
export class ServicePhoto extends BaseEntity {
	@Column({ name: 'content', type: 'varchar', length: 100, nullable: false })
	content: string;

	@JoinColumn({ name: 'service_id' })
	@ManyToOne(type => Service, service => service.photos)
	service: Service;
}
