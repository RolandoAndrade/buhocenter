import { HttpRepository } from "@/http/http.repository";
import * as CART_INTERFACE from "../interfaces/carts.interface";

class CartsHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'carts';

    /**
     * Permite agregar el producto al cart del client que está actualmente en línea
     * @param data objeto que contiene todos los datos necesarios para agregar el producto al cart
     */
    public async addProductToCart(data: CART_INTERFACE.ProductCart) {
        return await this.post(this.createUri([`${CartsHttpRepository.RESOURCE}`, 'products']), data, this.createHeader());
    }

    /**
     * Permite agregar el service al cart del client que está actualmente en línea
     * @param data objeto que contiene todos los datos necesarios para agregar el producto al cart
     */
    public async addServiceToCart(data: CART_INTERFACE.ServiceCart) {
        return await this.post(this.createUri([`${CartsHttpRepository.RESOURCE}`, 'services']), data, this.createHeader());
    }

    /**
     * Permite obtener todos los productos del cart del client
     * @param clientId id de client
     */
    public async getItemsCars(clientId: number): Promise<any> {
        try {
            return await this.get(
                this.createUri([`${CartsHttpRepository.RESOURCE}`, `client/${clientId}`]),
                this.createHeader(),
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * 
     * @param productCartId id de producto_cart a eliminar
     */
    public async deleteProductCart(productCartId: number): Promise<any> {
        try {
            return await this.delete(
                this.createUri([`${CartsHttpRepository.RESOURCE}`, `products/${productCartId}`]), this.createHeader());
        } catch (e) {
            return false;
        }
    }
}

export default new CartsHttpRepository();