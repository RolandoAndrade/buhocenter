export interface ShippingOrderItems {
    items: {
        description: string;
        item_weight: number;
        item_length: number;
        item_width: number;
        item_height: number;
        characteristics: { characteristic_id: number }[];
    }[];
}
