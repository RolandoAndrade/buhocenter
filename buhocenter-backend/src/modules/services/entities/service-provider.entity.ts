import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Service } from './service.entity';
import { Provider } from '../../products/entities/provider.entity';

@Entity({ name: 'service_provider' }) 
export class ServiceProvider extends BaseEntity {

	@JoinColumn({ name: 'service_id' })
	@ManyToOne(type => Service, service => service.serviceProvider)
	services: Service;

	@JoinColumn({ name: 'provider_id' })
	@ManyToOne(type => Provider, provider => provider.serviceProviders)
	provider: Provider;
}
