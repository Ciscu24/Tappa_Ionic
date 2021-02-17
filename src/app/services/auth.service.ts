import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ApiUserService } from './api-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  public user:User = {
    id: -1,
    name: "",
    surnames: "",
    shipping: 0,
    call: 0,
    email: "",
    password: "",
    orders: null
  };

  constructor(private storage: NativeStorage,
    //private google: GooglePlus,
    private userService: ApiUserService,
    private router: Router) {
  }

  async init() {
    let u = null;
    try {
      u = await this.storage.getItem("userTappa");
    } catch (err) {
      u = null;
    }
    if (u != null) {
      this.user = u;
    }
  }

  public isLogged(): boolean {
    console.log(this.user.id);
    console.log(this.user);
    if (this.user.id == -1) {
      return false;
    } else {
      return true;
    }
  }

  public async logout() {
    this.user = {
      id: -1,
      name: "",
      surnames: "",
      shipping: 0,
      call: 0,
      email: "",
      password: "",
      orders: null
    }
    await this.storage.setItem("userTappa", this.user);
  }

  public async login(email:string, password:string) {
    try {
      let u = await this.returnUser(email, password);
      if (u) {
        this.user = u;
        console.log("Estoy en AuthService");
        console.log(this.user);
      }
    } catch (err) {
      this.user = {
        id: -1,
        name: "",
        surnames: "",
        shipping: 0,
        call: 0,
        email: "",
        password: "",
        orders: null
      }
    }
    await this.storage.setItem("userTappa", this.user);
    return this.user;
  }

  public async returnUser(email:string, password:string):Promise<User>{
    let userFind:User = {
      id: -1,
      name: "",
      surnames: "",
      shipping: 0,
      call: 0,
      email: "",
      password: "",
      orders: null
    };
    try{
      let users:Array<User> = await this.userService.getAllUsers();
      for(let u of users){
        if(u.email==email && u.password==password){
          userFind = u;
        }
      }
      return userFind;
    }catch(err){
      console.log(err);
      return {
        id: -1,
        name: "",
        surnames: "",
        shipping: 0,
        call: 0,
        email: "",
        password: "",
        orders: null
      };
    }

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isLogged()) {
      this.router.navigate(["/inicio-sesion"]);
      return false;
    }
    return true;
  }
}