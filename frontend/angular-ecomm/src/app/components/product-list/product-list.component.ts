import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string | null = '';
  previousCategoryId:number = 1;
  previousKeyWord:string='';
  searchMode:boolean = false;
  //pagination
  thePageNumber:number = 1;
  thePageSize: number = 5;
  totalElements: number = 0;
  
  //inject product service and route dependencies 
  constructor(private productService: ProductService, private cartService: CartService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }
  updatePageSize(newPageSize:string){
    // the '+' will convert newPageSize from a string to a number
    // set page number back to 1
    // call listProducts to repopulate products
    this.thePageSize = +newPageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }
  handleListProducts(){
        //check if 'id' parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
        //get 'id' param string and convert string to number using the '+' symbol
        if(hasCategoryId){
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
          this.currentCategoryName = this.route.snapshot.paramMap.get('name');
        }else{
          // if category id not available, default to category id 1
          this.currentCategoryId = 1;
          this.currentCategoryName = 'Books';
        }
        // Check if we have a different category than previously
        // Angular will reuse a component if it is currently being viewed
        //If there is a different category ID then set thePageNumber back to 1
        if(this.previousCategoryId != this.currentCategoryId){
          this.thePageNumber=1;
        }
        this.previousCategoryId = this.currentCategoryId;
        console.log(`current category ID=${this.currentCategoryId}, the page number= ${this.thePageNumber}`);
        //get products for given category id | remove 1 from page# because SPRING REST defaults to 0
        this.productService.getProductListPaginate(this.thePageNumber-1,this.thePageSize, this.currentCategoryId)
        .subscribe(
          this.processResult()
        );
  }

  handleSearchProducts(){
    const keyWord: string = this.route.snapshot.paramMap.get('keyword')!;
    if(this.previousKeyWord != keyWord){
      this.thePageNumber = 1;
    }
    this.previousKeyWord = keyWord;
    
    // Search for products using given keyword
    this.productService.searchProductsPageinate(this.thePageNumber-1, this.thePageSize, keyWord).subscribe(
      this.processResult()
    );
  }
  processResult(){
    return (data:any)=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }
  addToCart(theProduct:Product){
    console.log(`Adding to cart: ${theProduct.name}, it costs: ${theProduct.unitPrice}`);
    const theCartItem = new CartItem(theProduct);
    this.cartService.addItemToCart(theCartItem);
  }

}
