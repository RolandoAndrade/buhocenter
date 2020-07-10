import { HttpRepository } from '@/http/http.repository';
import firebase from '@/config/firebase';
import {
    CustomerInterface,
    FederatedCustomer,
    ResponseAuth,
    ResponseRegister,
} from '@/modules/client/auth/interfaces/customer.interface';
import { ROL, STATUS } from '@/config/constants';

class AuthRepository extends HttpRepository {
    private _USER;

    public async loginWithSocial(social: string): Promise<ResponseAuth | boolean> {
        let provider: any;
        if (social === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else if (social === 'facebook') {
            provider = new firebase.auth.FacebookAuthProvider();
        }
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            if (result) {
                // eslint-disable-next-line
                // @ts-ignore
                const token: string = result.credential.accessToken;
                const user: any = result.user;
                const userName: string[] = user.displayName.split(' ');
                const clientData: FederatedCustomer = {
                    first_name: userName[0],
                    last_name: userName[1],
                    uid: user.uid,
                    email: user.email,
                };
                const registerData: { token: string; clientData: FederatedCustomer } = {
                    token,
                    clientData,
                };
                try {
                    return await this.post(this.createUri(['users', 'login-social']), registerData);
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    public async login(email: string, password: string): Promise<any> {
        try {
            const userLog = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (userLog) {
                const registerData: { token: string; uid: string } = {
                    // eslint-disable-next-line
                    // @ts-ignore
                    token: userLog.user.l,
                    // eslint-disable-next-line
                    // @ts-ignore
                    uid: userLog.user.uid,
                };
                try {
                    return await this.post(this.createUri(['users', 'login']), registerData);
                } catch (e) {
                    return { error: e.message };
                }
            }
        } catch (e) {
            return { error: e.message };
        }
    }

    public async logout(uid: string) {
        await this.post(this.createUri(['users', 'logout']), { uid }, this.createHeader());
        await firebase.auth().signOut();
    }

    public async registerCustomer(customer: CustomerInterface): Promise<ResponseRegister> {
        try {
            const result = await firebase
                .auth()
                .createUserWithEmailAndPassword(customer.email!, customer.password!);
            if (result) {
                const data: CustomerInterface = {
                    name: customer.name!,
                    lastName: customer.lastName!,
                    birthdate: customer.birthDate!,
                    cellphone: customer.cellphone,
                    uid: result.user!.uid,
                    is_federate: false,
                    language: customer.language!,
                    email: customer.email!,
                    role: { id: ROL.customer },
                };
                return await this.post(this.createUri(['users', 'register']), data);
            }
            return { error: 'Unexpected error' };
        } catch (e) {
            return { error: e.message };
        }
    }

    public async updateCustomerCredencials({ email, psswd }): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                firebase.auth().onAuthStateChanged(async function (user) {
                    if (user) {
                        try {
                            await user.updateEmail(email);
                            await user.updatePassword(psswd);
                            resolve(true);
                        } catch (e) {
                            reject(false);
                        }
                    } else {
                        reject(false);
                    }
                });
            });
        } catch (e) {
            return e.message;
        }
    }
}

export default new AuthRepository();
