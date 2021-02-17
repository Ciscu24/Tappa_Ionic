import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Order } from '../model/Order';

@Injectable({
  providedIn: 'root'
})
export class ApiOrderService {

  constructor(private http:HTTP) { }

  public getAllOrders():Promise<Order[] | null>{
    return new Promise((resolve, reject)=>{
      const endpoint = environment.endpoint + environment.apiOrder; //http://localhost:8080/order/
      this.http.get(endpoint, {}, this.header)
      .then(d=>{
        if(d){
          console.log(d.data);
          resolve(JSON.parse(d.data));
        }else{
          resolve(null);
        }
      })
      .catch(err=>reject(err))
    })
  }

  public createOrder(order:Order): Promise<void>{
    const endpoint = environment.endpoint + environment.apiOrder;
    return new Promise((resolve, reject) => {
      if(order){
        this.http.setDataSerializer('json');
        this.http
          .post(endpoint, order, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      } else{
        reject("User no exists");
      }
    })
  }

  public getOrder(id?:number | string): Promise<Order[] | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiOrder;
      if(id){
        endpoint+=id;
      }
      this.http
        .get(endpoint, {}, this.header)
        .then(d => {
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        })
        .catch(err => reject(err));
    })
  }
 
  public removeOrder(order:Order): Promise<void> {
    const id:any = order.id ? order.id : order;
    const endpoint = environment.endpoint + environment.apiOrder;
    return new Promise((resolve, reject) => {
      this.http
        .delete(endpoint, {}, this.header)
        .then(d => {
          resolve();
        })
        .catch(err => reject(err));
    })
  }

  public updateOrder(order: Order): Promise<void> {
    const endpoint = environment.endpoint + environment.apiOrder;
    return new Promise((resolve, reject) => {
      if(order){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, order, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      }else{
        reject("User no exists");
      }
    })
  }

  public getOrdersByUserId(id?:number | string): Promise<Order[] | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiOrder + "users/";
      if(id){
        endpoint+=id;
      }
      this.http
        .get(endpoint, {}, this.header)
        .then(d => {
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        })
        .catch(err => reject(err));
    })
  }

  public getAllPriceForOrder(id?:number | string): Promise<number | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiOrder + "price/";
      if(id){
        endpoint+=id;
      }
      this.http
        .get(endpoint, {}, this.header)
        .then(d => {
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        })
        .catch(err => reject(err));
    })
  }

  private get header():any{
    return {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  }
}
