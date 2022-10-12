import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl: string | undefined;
    unitPrice: number | undefined;
    quantity: number | undefined;
    productId:string | number | undefined;

    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity =cartItem.quantity;
        this.productId = cartItem.id;

    }

}
