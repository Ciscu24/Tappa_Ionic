import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Food } from '../model/Food';

@Injectable({
  providedIn: 'root'
})
export class ApiFoodService {

  constructor(private http:HTTP) { }

  /**
   * Método que devuelve toda la comida de la base de datos
   */
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

  /**
   * Método que crea una comida
   * @param food la comida a crear
   */
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

  /**
   * Método que devuelve una comida en específico
   * @param id el id de la comida
   */
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
 
  /**
   * Método que borra una comida en específico
   * @param food la comida a borrar
   */
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

  /**
   * Método que modifica una comida en específico
   * @param food comida a modificar
   */
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
