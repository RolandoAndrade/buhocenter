export interface CustomerLoyaltyTickets {
    confirmationId: string;
    date: Date;
    userEmail: string;
    currency: string;
    pointsToDollars: number;
    accumulatedPoints: number;
    commission: number;
    status: string;
    apiKey?: string;
}
