import firebase from '../config/firebase';

export default class FirebaseRepository {

    getImage(url: string): Promise<any> {
        return firebase.storage().ref(url).getDownloadURL();
    }


    async uploadImage(file,id): Promise<any>{    	
	    const storageRef = await firebase.storage().ref(`products/${id}/${file.name}`).put(file);	    
      }
    }      
    