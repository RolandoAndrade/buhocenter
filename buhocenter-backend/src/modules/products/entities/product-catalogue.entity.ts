import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Catalogue } from './catalogue.entity';
import { ProductCategory } from './product-category.entity';

@Entity('product_catalogue')
export class ProductCatalogue extends BaseEntity {
	
	@JoinColumn({ name: 'catalogue_id' })
	@ManyToOne(type => Catalogue , catalogue => catalogue.productCatalogues)
	catalogue: Catalogue;

	@JoinColumn({ name: 'product_category_id' })
	@ManyToOne(type => ProductCategory, productCategory => productCategory.productCatalogues)
	productCategory: ProductCategory;
}
