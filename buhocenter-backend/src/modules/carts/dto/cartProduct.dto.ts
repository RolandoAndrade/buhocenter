export class CartProductDTO {
  readonly quantity:number;
  readonly product: {
  		readonly id:number;
  };
  readonly customer: {
  		readonly id:number;
	}
}