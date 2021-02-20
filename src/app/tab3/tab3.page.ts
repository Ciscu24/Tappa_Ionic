import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { ApiUserService } from '../services/api-user.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { Camera } from '@ionic-native/camera/ngx';
import { CameraService } from '../services/camera.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  public imgURL = "assets/user_default.png";

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
    private cameraService: CameraService,
    private alertController: AlertController,
    private router:Router) {}

  ngOnInit(){
  }

  async ionViewWillEnter(){
    await this.loadService.cargarLoading();
    try{
      this.authService.user = await this.userService.getUser(this.authService.user.id);
      this.user = await this.authService.user;
      console.log(this.authService.user);
      this.haveImage();
      await this.loadService.pararLoading();
    }catch(err){
      console.log(err);
      await this.loadService.pararLoading();
    }
    
  }
  
  public logout(){
    this.authService.logout();
    if(!this.authService.isLogged()){
      this.router.navigate(['/inicio-sesion'])
    }
  }

  public haveImage(){
    if(this.user.image ==  "" || this.user.image == null){
      this.imgURL = "assets/user_default.png";
    }else{
      this.imgURL = this.cameraService.dataBase64 + this.user.image;
    }
  }

  public async changeImage(){
    let image:string = "";

    const alert = await this.alertController.create({
      header: 'Cambiar Foto',
      buttons: [
        {
          text: 'Camara',
          handler: () => {
            image = "Camara";
          }
        },
        {
          text: 'Galeria',
          handler: () => {
            image = "Galeria";
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            image = "";
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();

    try{
      if(image == "Galeria"){
        let photo = await this.cameraService.getGallery()
        this.imgURL = this.cameraService.dataBase64 + photo;
        this.user.image = photo;
  
        console.log(this.user.image);
        this.loadService.cargarLoading();
        this.userService.updateImage(this.user.id, this.user.image);
        this.imgURL = this.cameraService.dataBase64 + this.user.image;
        setTimeout(() => {
          this.loadService.pararLoading();
         }, 1000);
      }else if(image == "Camara"){
        let photo2 = await this.cameraService.getCamera()
        this.imgURL = this.cameraService.dataBase64 + photo2;
        this.user.image = photo2;
        console.log(this.user.image);
        this.loadService.cargarLoading();
        this.userService.updateImage(this.user.id, this.user.image);
        this.imgURL = this.cameraService.dataBase64 + this.user.image;
        setTimeout(() => {
          this.loadService.pararLoading();
         }, 1000);
      }else{
        this.loadService.cargarLoading();
        this.userService.updateImage(this.user.id, "");
        this.haveImage();
        setTimeout(() => {
          this.loadService.pararLoading();
         }, 1000);
      }
    }catch(err){
      console.log(err);
      this.loadService.cargarLoading();
      this.userService.updateImage(this.user.id, "");
      setTimeout(() => {
        this.loadService.pararLoading();
       }, 1000);
    }
  }
}
