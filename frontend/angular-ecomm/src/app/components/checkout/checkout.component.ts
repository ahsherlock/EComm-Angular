import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { AlecEcommFormServiceService } from 'src/app/services/alec-ecomm-form-service.service';

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


  constructor(private formBuilder:FormBuilder, private alecEcommFormService: AlecEcommFormServiceService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
      }),
      billingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:[''],
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
    console.log("Handling submission of data");
    console.log(this.checkoutFormGroup.get('customer')?.value);

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
