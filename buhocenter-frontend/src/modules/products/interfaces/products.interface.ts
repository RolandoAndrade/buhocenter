export interface ProductsInterface {
	id: number;
    productName: string;
    description: string;
    price: number;
    shippingPrice: number;
    minimumQuantityAvailable: number;
    brand:{
    	id: number;
    }
    provider: {
    	id: number[];
    }
    category:{
    	id: number;
    }
}

export interface InventoryProduct{
    quantity: number;
    product:{
        id: number;
    }
}

export interface dimensionDto {
    dimension:{
        width: number;
        height:number;
        long: number;
    }
    id : number;
}

export interface ProductPhotoDto{
    id : number;
    imageName : string;
}

export interface CatalogueDto{     
    id:number;
    category:{id: number;}
    product:{id: number;}           
}