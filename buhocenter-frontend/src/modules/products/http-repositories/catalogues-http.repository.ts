import { HttpRepository } from '@/http/http.repository';

class CataloguesHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'categories';
    private static readonly RESOURCECATALOGUE = 'catalogues';

    public getCataloguesByCategory(categoryId: string) {
        return this.get(this.createUri([`${CataloguesHttpRepository.RESOURCE}/catalogues?category_id=${categoryId}`]));
    }

    public getAllCatalogues(){
    	return this.get(this.createUri([`${CataloguesHttpRepository.RESOURCECATALOGUE}`]))
    }

    public saveCatalogue(data){
    	return this.post(this.createUri([`${CataloguesHttpRepository.RESOURCECATALOGUE}`]),data,false);    	
    }

}

export default new CataloguesHttpRepository();