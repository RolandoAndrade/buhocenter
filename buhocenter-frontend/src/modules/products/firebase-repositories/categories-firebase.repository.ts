import FirebaseRepository from '@/http/firebase.repository';

class CategoriesFirebaseRepository extends FirebaseRepository {
    private static readonly RESOURCE = 'categories';

    async getCategoryPhotoByName(fileName: string) {
        return this.getImage(`${CategoriesFirebaseRepository.RESOURCE}/${fileName}`);
    }
}

export default new CategoriesFirebaseRepository();