import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { ApiUserService } from '../services/api-user.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  public user:User = {
    name: "",
    surnames: "",
    shipping: 0,
    call: 0,
    email: "",
    password: ""
  };

  constructor(
    private authService: AuthService,
    private userService: ApiUserService,
    private loadService: LoadingService,
    private router:Router) {}

  ngOnInit(){
  }

  async ionViewWillEnter(){
    await this.loadService.cargarLoading();
    this.authService.user = await this.userService.getUser(this.authService.user.id);
    this.user = await this.authService.user;
    console.log(this.authService.user);
    await this.loadService.pararLoading();
  }
  
  public logout(){
    this.authService.logout();
    if(!this.authService.isLogged()){
      this.router.navigate(['/inicio-sesion'])
    }
  }

}
