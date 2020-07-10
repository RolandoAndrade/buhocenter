import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductCatalogue } from '../entities/product-catalogue.entity';
import { Category } from '../entities/category.entity';
import { STATUS } from '../../../config/constants';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(ProductCatalogue)
        private readonly productCategoryRepository: Repository<ProductCatalogue>,
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>,
    ) {}

    async getAllCategories(): Promise<Category[]> {
        return await this.categoriesRepository.find({
            relations: ['catalogues', 'catalogues.status'],
        });
    }

    public async getCategory(categoryId: number): Promise<Category> {
        return await this.categoriesRepository.findOne(categoryId);
    }

    public async createCategoryProduct(categoryId: number, product: Product) {
        this.logger.debug(
            `createCategoryProduct: the category ${categoryId} is alredy associated to the product ${product.id}`,
            { context: CategoriesService.name },
        );
        const newCategoryProduct = new ProductCatalogue();

        this.logger.debug(`createCategoryProduct: ${JSON.stringify(newCategoryProduct.catalogue)}`, {
            context: CategoriesService.name,
        });
        newCategoryProduct.product = product;
        await this.productCategoryRepository.save(newCategoryProduct);
    }

    public async checkProductsCategories(categoryId: number, productId: number): Promise<boolean> {
        const productsCategories = await this.productCategoryRepository.find({
            where: { category: categoryId, product: productId },
        });

        if (productsCategories) {
            this.logger.info(
                `checkProductsCategories: the category ${categoryId} is alredy associated to the product ${productId}`,
                { context: CategoriesService.name },
            );
            return false;
        } else {
            return true;
        }
    }

    /**
     * getCategories
     * Get a set og categories
     * @returns  Promise<Category[]>
     */
    public async getCategories(): Promise<Category[]> {
        try {
            this.logger.debug(`getCategories: executting query to get all categories`, {
                context: CategoriesService.name,
            });
            return await this.categoriesRepository.find({
                relations: ['catalogues'],
                where: `status_id = ${STATUS.ACTIVE.id}`,
            });
        } catch (e) {
            this.logger.error(`getCategories: catch error [error:${e.message}]`, {
                context: CategoriesService.name,
            });
            throw e;
        }
    }

    /**
     * Obtiene el listado de categorias
     */
    public async getCataloguesByCatergory(id: number): Promise<Response> {
        try {
            this.logger.debug(
                `getCataloguesByCatergory: ejecutando query para obtener catalogues por category`,
                { context: CategoriesService.name },
            );
            return await this.categoriesRepository.query(
                `
            SELECT distinct ca.id AS id, ca.name AS name, ca.term AS term
            FROM catalogues ca
            WHERE ca.category_id = ${id}
            `.trim(),
            );
        } catch (e) {
            this.logger.error(`getCataloguesByCatergory: catch error [error:${e.message}]`, {
                context: CategoriesService.name,
            });
            return Response.error();
        }
    }

    public async findCategory(categoryId: number): Promise<Category> {
        return await this.categoriesRepository.findOne(categoryId);
    }
}
