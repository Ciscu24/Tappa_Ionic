import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Food } from '../model/Food';

@Injectable({
  providedIn: 'root'
})
export class ApiFoodService {

  constructor(private http:HTTP) { }

  public getAllFood():Promise<Food[] | null>{
    return new Promise((resolve, reject)=>{
      const endpoint = environment.endpoint + environment.apiFood; //http://localhost:8080/food/
      this.http.get(endpoint, {}, this.header)
      .then(d=>{
        if(d){
          resolve(JSON.parse(d.data));
        }else{
          resolve(null);
        }
      })
      .catch(err=>reject(err))
    })
  }

  public createFood(food:Food): Promise<void>{
    const endpoint = environment.endpoint + environment.apiFood;
    return new Promise((resolve, reject) => {
      if(food){
        this.http.setDataSerializer('json'); 
        this.http
          .post(endpoint, food, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      } else{
        reject("User no exists");
      }
    })
  }

  public getFood(id?:number | string): Promise<Food[] | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiFood;
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
 
  public removeFood(food:Food): Promise<void> {
    const id:any = food.id ? food.id : food;
    const endpoint = environment.endpoint + environment.apiFood;
    return new Promise((resolve, reject) => {
      this.http
        .delete(endpoint, {}, this.header)
        .then(d => {
          resolve();
        })
        .catch(err => reject(err));
    })
  }

  public updateFood(food: Food): Promise<void> {
    const endpoint = environment.endpoint + environment.apiFood;
    return new Promise((resolve, reject) => {
      if(food){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, food, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      }else{
        reject("User no exists");
      }
    })
  }

  private get header():any{
    return {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  }
}
