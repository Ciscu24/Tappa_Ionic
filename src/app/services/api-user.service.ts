import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  constructor(private http:HTTP) { }

  /**
   * Método que devuelve todos los usuarios de la base de datos
   */
  public getAllUsers():Promise<User[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiUser; //http://localhost:8080/user/
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
   * Método que crea un usuario
   * @param user el usuario a crear
   */
  public createUser(user:User): Promise<void>{
    const endpoint = environment.endpoint + environment.apiUser;
    return new Promise((resolve, reject) => {
      if(user){
        this.http.setDataSerializer('json'); 
        this.http
          .post(endpoint, user, this.header)
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
   * Método que devuelve un usuario en específico
   * @param id el id del usuario
   */
  public getUser(id?:number | string): Promise<User | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiUser;
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
   * Método que borra un usuario en especifíco
   * @param user el usuario a borrar
   */
  public removeUser(user:User): Promise<void> {
    const id:any = user.id ? user.id : user;
    const endpoint = environment.endpoint + environment.apiUser;
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
   * Método que modifica un usuario en específico
   * @param user usuario a modificar
   */
  public updateUser(user: User): Promise<void> {
    const endpoint = environment.endpoint + environment.apiUser;
    return new Promise((resolve, reject) => {
      if(user){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, user, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      }else{
        reject("User no exists");
      }
    })
  }

  /**
   * Método que modifica la llamada y el envio de un usuario
   * @param id el id del usuario que se va a modificar
   * @param call los puntos de llamada
   * @param shipping los puntos de envio
   */
  public updateCallAndShipping(id:number | string, call:number, shipping:number): Promise<void> {
    const endpoint = environment.endpoint + environment.apiUser + "/edit/" + id;
    let myObject = {
      shipping: shipping,
      call: call
    }
    return new Promise((resolve, reject) => {
      if(id){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, myObject, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      }else{
        reject("User no exists");
      }
    })
  }

  /**
   * Método que modifica la imagen del usuario
   * @param id el id del usuario en cuestión
   * @param image la imagen que se va a modificar
   */
  public updateImage(id:number | string, image:string): Promise<void> {
    const endpoint = environment.endpoint + environment.apiUser + "/editimage/" + id;
    let myImage = {
      image: image
    }
    return new Promise((resolve, reject) => {
      if(id){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, myImage, this.header)
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
