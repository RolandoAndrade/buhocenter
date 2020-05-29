import { Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { ProductCatalogue } from './product-catalogue.entity';

@Entity({ name: 'product_category' })
export class ProductCategory extends BaseEntity {

	@JoinColumn({ name: 'category_id' })
	@ManyToOne(type => Category, category => category.productCategories)
	category: Category;

	@JoinColumn({ name: 'product_id' })
	@ManyToOne(type => Product, products => products.productCategories)
	product: Product;

	@OneToMany(type => ProductCatalogue, productCatalogues => productCatalogues.productCategory)
	productCatalogues: ProductCatalogue[];
}
