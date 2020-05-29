import { HttpRepository } from '@/http/http.repository';
import firebase from "@/config/firebase";
import { ClientSocial } from '@/store/auth-module/interfaces/ClientGmail'
import { CustomerInterface } from '@/modules/auth-module/interfaces/CustomertInterface';

class AuthRepository extends HttpRepository {
    private _USER;

    public async loginWithSocial(social: string): Promise<any> {
        let provider: any;
        if ( social === 'google' ) {
            provider = new firebase.auth.GoogleAuthProvider();
        } else if ( social === 'facebook' ) {
            provider = new firebase.auth.FacebookAuthProvider();
        }
        try{
            const result = await firebase.auth().signInWithPopup(provider);
            if ( result ) {
                // @ts-ignore
                const token: string = result.credential.accessToken;
                const user: any = result.user;
                const userName: string[] = user.displayName.split(' ');
                const clientData: ClientSocial = {
                    first_name: userName[0],
                    last_name: userName[1],
                    uid: user.uid,
                    email: user.email,
                };
                const registerData: { token: string, clientData: ClientSocial } = { token, clientData };
                try {
                    return await this.post(this.createUri(['users', 'login-social'], false), registerData, false);
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        } catch (e) {
            // console.log(e)
            return false;
        }
    }

    public async login(email: string, password: string): Promise<any> {
        try {
            const userLog = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (userLog) {
                // @ts-ignore
                const registerData: { token: string, uid: string } = { token: userLog.user.l , uid: userLog.user.uid };
                try {
                    return await this.post(this.createUri(['users', 'login']), registerData);
                } catch (e) {
                    return { error: e.message};
                }
            }
        } catch (e) {
            return { error: e.message };
        }
    }

    public async logout(uid: string): Promise<any> {
        await this.post(this.createUri(['users', 'logout']), { uid }, this.createHeader());
        return await firebase.auth().signOut();
    }

    public async registerCustomer(customer: CustomerInterface): Promise<any> {
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(customer.email, customer.password);
            if ( result ) {
                const data: { name: string, lastname: string, birthdate: string, uid: string, language: number, email: string, } = {
                    name: customer.name,
                    lastname: customer.lastName,
                    birthdate: customer.birthdate,
                    // @ts-ignore
                    uid: result.user.uid,
                    language: customer.language,
                    email: customer.email,
                };
                return await this.post(this.createUri(['users', 'register']), data);
            }
            return { error:  'Unexpected error'};
        } catch (e) {
            return { error: e.message};
        }
    }

    public async updateCustomerCredencials({ email, psswd }): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                firebase.auth().onAuthStateChanged(async function(user) {
                    if (user) {
                        console.log('user signed in');
                        try {
                            await user.updateEmail(email);
                            await user.updatePassword(psswd);
                            resolve(true);
                        } catch(e) {
                            reject(false);
                        }
                    } else {
                        console.log('user NOT signed in');
                        reject(false);
                    }
                });
            })
        } catch(e) {
            return e.message;
        }
    }
}

export default new AuthRepository();