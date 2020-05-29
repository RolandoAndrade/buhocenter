import FirebaseRepository from "@/http/firebase.repository";

class ProductsFirebaseRepository extends FirebaseRepository {
    private static readonly RESOURCE = 'products';

    async getProductPhotoByName(productId: number, fileName: string) {
        return this.getImage(`${ProductsFirebaseRepository.RESOURCE}/${productId}/${fileName}`);
    }


}

export default new ProductsFirebaseRepository();