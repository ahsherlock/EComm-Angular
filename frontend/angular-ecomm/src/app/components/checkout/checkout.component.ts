import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { AlecEcommFormServiceService } from 'src/app/services/alec-ecomm-form-service.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { AlecEcommValidators } from 'src/app/validators/alec-ecomm-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup: FormGroup = this.formBuilder.group({});
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears:number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] =[];
  storage: Storage = sessionStorage;

  constructor(private formBuilder:FormBuilder,
              private cartService: CartService,
              private alecEcommFormService: AlecEcommFormServiceService,
              private checkoutService:CheckoutService, 
              private router:Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    //get user email from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
        lastName:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
        email: new FormControl(theEmail,[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), AlecEcommValidators.notOnlyWhiteSpace])
      }),
      shippingAddress: this.formBuilder.group({
        street:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: this.formBuilder.group({
        street:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required, Validators.minLength(2), AlecEcommValidators.notOnlyWhiteSpace]),
        cardNumber:new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth:new FormControl('',[Validators.required]),
        expirationYear:new FormControl('',[Validators.required]),
      })

    });
    // populate credit card months
    const startMonth:number = new Date().getMonth()+1;
    console.log(`start month: ${startMonth}`);
    this.alecEcommFormService.getCreditCardMonths(startMonth).subscribe(
      data=> {
        console.log("Retrieved credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    // populate credit card years
    this.alecEcommFormService.getCreditCardYears().subscribe(
      data=>{
        console.log("Retrieved credit card years: "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    )
      // populate countries
      this.alecEcommFormService.getCountries().subscribe(
        data=>{
          console.log("Retrieved countries: "+ JSON.stringify(data));
          this.countries = data;
        }
      );
  }
  // GETTER METHODS FOR VALIDATION
  //Customer Validation
  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}
  // Shipping Validation
  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  // Billing Validation
  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}
  // Credit Card Validation
  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}

  reviewCartDetails(){
    //subscribe to cartservice total quantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    //subscribe to cartservice total price
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth:number; 
    if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1;
    }else{
      startMonth = 1;
    }
    this.alecEcommFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrieved Credit Card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    const cartItems = this.cartService.cartItems;
    // create orderItems from cartItems. loops over cartItems array, for every item(tempCartItem) create a new OrderItem
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //setup Purchase
    let purchase = new Purchase();
    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    //populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;
    //populate purchase - billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingAddressCountry.name;
    //populate purchase - corder and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call RESTAPI via checkoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response=> {
          alert(`Your order has been recieved! \n Your order tracking number is: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err=>{
          alert(`There was an error with your order: ${err.message}`);
        }

      }
    )

  }

  resetCart(){
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    //reset form data
    this.checkoutFormGroup.reset();
    // nav back to products page
    this.router.navigateByUrl("/products");
  }


  copyShippingAddressToBillingAddress(event:any) {
      if(event.target?.checked){
        this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        this.billingAddressStates = this.shippingAddressStates;
      }else{
        this.checkoutFormGroup.controls['billingAddress'].reset();
        this.billingAddressStates = [];
      }
    }
    getStates(formGroupName:string){
      const formGroup = this.checkoutFormGroup.get(formGroupName);
      const countryCode = formGroup?.value.country.code;
      const countryName= formGroup?.value.country.name;

      this.alecEcommFormService.getStates(countryCode).subscribe(
        data => {
          if(formGroupName === 'shippingAddress'){
            this.shippingAddressStates = data;
          } else {
            this.billingAddressStates = data;
          }
          formGroup?.get('state')?.setValue(data[0]);
        }
      )

    }
}
