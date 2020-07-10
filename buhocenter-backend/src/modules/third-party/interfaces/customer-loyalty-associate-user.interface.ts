import { CustomerLoyaltyStatus } from '../enums/customer-loyalty-status.enum';

export interface CustomerLoyaltyAssociateUser {
    apiKey: string;
    userEmail: string;
    userCode?: string;
}

export interface CustomerLoyaltyAssociateUserResponse {
    request: CustomerLoyaltyAssociateUser;
    responseStatus: CustomerLoyaltyStatus;
}

export interface CustomerLoyaltyAssociateUserCodeResponse {
    request: CustomerLoyaltyAssociateUser;
    userToken: string;
}
