import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
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
  searchMode:boolean = false;
  //inject product service and route dependencies 
  constructor(private productService: ProductService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
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
        // now get products for given category id
        this.productService.getProductList(this.currentCategoryId).subscribe(
          data => {
            this.products = data;
          }
        )
  }
  handleSearchProducts(){
    const keyWord: string = this.route.snapshot.paramMap.get('keyword')!;
    // Search for products using given keyword
    this.productService.searchProducts(keyWord).subscribe(
      data =>{
        this.products = data;
      }
    )
  }

}
