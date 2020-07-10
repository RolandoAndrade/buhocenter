export interface ResponseAuth {
    apiAccessToken: string;
    token: string;
    data: {
        id: number;
        name: string;
        lastName: string;
        uid: string;
        status: any;
        role: any;
        email: string;
        cellphone: string;
        is_federate: boolean;
        birthDate: Date;
        language: any;
        addresses?: any;
    };
}
