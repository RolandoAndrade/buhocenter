import FirebaseRepository from '@/http/firebase.repository';

class ServicesFirebaseRepository extends FirebaseRepository {
    private static readonly RESOURCE = 'services';

    async getServicePhotoByName(serviceId: number, photo: string) {
        return this.getImage(`${ServicesFirebaseRepository.RESOURCE}/${serviceId}/${photo}`);
    }
}

export default new ServicesFirebaseRepository();
