export interface CustomerLoyaltyUpdateProductPointsInterfaces {
    user: { id: number | undefined };
    products: { id: number; price: number; canAccumulatePoints: boolean | undefined }[];
}
