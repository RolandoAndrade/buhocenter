import { HttpRepository } from '@/http/http.repository';

class ProductsHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'products';
    private static readonly RESOURCEDIMENSION = 'products/dimension';
    private static readonly RESOURCEIMAGE = 'products/image';
    private static readonly RESOURCEINVENTORY= 'products/inventory'

    public getProducts(page: number, catalogueId: number = 1) {
        return this.get(this.createUri([`${ProductsHttpRepository.RESOURCE}`], { page, catalogueId }));
    }

    public getProductById(id: number) {
        return this.get(this.createUri([`${ProductsHttpRepository.RESOURCE}`, `${id}`]));
    }
    updateProductData(product){
    	return this.patch(this.createUri([`${ProductsHttpRepository.RESOURCE}`], false), product, false);
    }
    private static readonly RESOURCE_ALL = 'products/all/1';
    
    getAllProducts(){
    	return this.get(this.createUri([`${ProductsHttpRepository.RESOURCE_ALL}`]));
    }

    public deleteProducts(id){
        return this.delete(this.createUri([`${ProductsHttpRepository.RESOURCE}`,`${id}`],false),false);
    }

    public getProductsDailyRecommendation() {
        return this.get(this.createUri([`${ProductsHttpRepository.RESOURCE}`, `daily-recommendation`]));
    }

    public createProduct(product){
        return this.post(this.createUri([`${ProductsHttpRepository.RESOURCE}`]),product);   
    }
   
    public uploadImage(data){
        return this.post(this.createUri([`${ProductsHttpRepository.RESOURCEIMAGE}`]),data);
    }
   
    public createDimension(data){
        return this.post(this.createUri([`${ProductsHttpRepository.RESOURCEDIMENSION}`]),data);
    }
    public saveInventary(data){
        return this.post(this.createUri([`${ProductsHttpRepository.RESOURCEINVENTORY}`]),data);
    }

    public updateInventory(data){
        return this.patch(this.createUri([`${ProductsHttpRepository.RESOURCEINVENTORY}`],false),data,false);
    }
}

export default new ProductsHttpRepository();