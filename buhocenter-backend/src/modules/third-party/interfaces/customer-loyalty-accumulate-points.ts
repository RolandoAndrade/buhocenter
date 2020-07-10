import { CustomerLoyaltyActions } from '../enums/customer-loyalty-actions.enum';
import { CustomerLoyaltyItems } from './customer-loyalty-items';
import { CustomerLoyaltyTickets } from './customer-loyalty-tickets';

export interface CustomerLoyaltyAccumulatePoints {
    apiKey: string;
    type: CustomerLoyaltyActions;
    products: CustomerLoyaltyItems[];
}

export interface CustomerLoyaltyAccumulatePointsResponse {
    request: CustomerLoyaltyAccumulatePoints;
    totalTentativeCommission: number | null;
    confirmationTicket: CustomerLoyaltyTickets | null;
}
