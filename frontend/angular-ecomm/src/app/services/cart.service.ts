import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  
  constructor() { }
  
  
  addItemToCart(theCartItem: CartItem){
    //check for item existing in cart
    let alreadyExistsInCart:boolean = false;
    let existingCartItem: CartItem|undefined;
    if(this.cartItems.length > 0){
       //find item in cart based on id
       existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
       if(existingCartItem){
        alreadyExistsInCart = true;
       }else{
        alreadyExistsInCart = false;
       }
       //alreadyExistsInCart = (existingCartItem != undefined);
    }
    //check if found
    if(alreadyExistsInCart){
      existingCartItem!.quantity! = existingCartItem!.quantity!+ 1;
    }else{
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals(){
    let totalPriceValue:number = 0;
    let totalQuantityValue:number = 0
    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity! * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity!;
    }
    //Publish the new values to all subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue, totalQuantityValue)
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("");
    console.log('CONTENTS OF THE SHOPPING CART');
    console.log("")
    for(let temporaryCartItem of this.cartItems){
      const subTotalPrice = temporaryCartItem.quantity! * temporaryCartItem.unitPrice;
      console.log(`Name: ${temporaryCartItem.name}, Quantity Purchased: ${temporaryCartItem.quantity} at this unit price: ${temporaryCartItem.unitPrice}, the Sub Total price for all items is: ${subTotalPrice.toFixed(2)}`);
    }
    console.log(`The total price of cart is: ${totalPriceValue.toFixed(2)}, the total number of items in cart is: ${totalQuantityValue}`);
    console.log("--------")
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity!--;
    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem:CartItem){
    // get index of item in item array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)
    // if found remove item from array at given index
    if (itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}

