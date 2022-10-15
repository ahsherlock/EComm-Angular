import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private orderUrl = environment.alecEcommApiUrl+'/orders';
  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail:string): Observable<GetResponseOrderHistory>{
    //build the URL based on customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}
interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }
}
