import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Catalogue } from '../../products/entities/catalogue.entity';
import { Service } from './service.entity';
import { ServiceCategory } from './service-category.entity';

@Entity({ name: 'service_catalogue' })
export class ServiceCatalogue extends BaseEntity {

	@JoinColumn({ name: 'catalogue_id' })
	@ManyToOne(type => Catalogue, catalogue => catalogue.serviceCatalogues)
	catalogue: Catalogue;

	@JoinColumn({ name: 'service_category_id' })
	@ManyToOne(type => ServiceCategory, serviceCategory => serviceCategory.serviceCatalogues)
	serviceCategory: ServiceCategory;
}
