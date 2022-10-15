import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private baseUrl = environment.alecEcommApiUrl+'/products';
  private categoryUrl = environment.alecEcommApiUrl+'/product-category';

  constructor(private httpClient:HttpClient) { }


  // Get product/products methods. Contacts endpoints provided by SpringREST.

  // Pagination when searching keywords
  searchProductsPageinate(thePage:number, thePageSize:number, keyWord:string):Observable<GetResponseProducts>{
    const searchPaginationUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchPaginationUrl);
  }
  //Pagination call to get products. Builds URL with categoryId, the page, and the size of the page(# of products per page)
  getProductListPaginate(thePage:number, thePageSize:number,theCategoryId:number):Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  // Get list of products based off of CategoryID
  getProductList(theCategoryId:number):Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
    return this.getProducts(searchUrl);
  }
  // Search through products to find products that contain the keyWord
  searchProducts(keyWord: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}`;
    return this.getProducts(searchUrl);
  }
  // Gets all products
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  // Gets single product
  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }
  // Gets the product categories
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}
interface GetResponseProducts{
  _embedded:{
    products:Product[];
  },
  page: {
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }

}
interface GetResponseProductCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }

}