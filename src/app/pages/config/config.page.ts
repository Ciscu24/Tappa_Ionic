import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/model/User';
import jsSHA from 'jssha';
import { ApiUserService } from 'src/app/services/api-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  public user:User={
    name: "",
    surnames: "",
    shipping: 0,
    call: 0,
    email: "",
    password: ""
  };

  constructor(private authService: AuthService, 
    private usuarioService: ApiUserService, 
    private modalController:ModalController,
    private toastService: ToastService,
    private alertController: AlertController,
    private loadService: LoadingService) { }

  async ngOnInit() {
    this.loadService.cargarLoading();
    try{
      this.authService.user = await this.usuarioService.getUser(this.authService.user.id);
      this.loadService.pararLoading();
      this.user = this.authService.user;
    }catch(err){
      console.log(err);
      this.loadService.pararLoading();
      this.toastService.presentToast("El usuario no se ha encontrado", "myToast", 2000, "primary")
      this.modalController.dismiss();
    }
    
  }

  public async changeName(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar nombre:',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(data.name);
            this.user.name = data.name;
          }
        }
      ]
    });

    await alert.present();
  }

  public async changeSurname(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar apellidos:',
      inputs: [
        {
          name: 'surname',
          type: 'text',
          placeholder: 'Apellidos...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(data.surname);
            this.user.surnames = data.surname;
          }
        }
      ]
    });

    await alert.present();
  }

  public async changePassword(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar contraseña:',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña...'
        },
        {
          name: 'passwordConfirm',
          type: 'password',
          placeholder: 'Confirmar contraseña...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if(data.password == data.passwordConfirm){
              let shaObj = new jsSHA("SHA-256", "TEXT");
              shaObj.update(data.password);
              let hash = shaObj.getHash("HEX");
              this.user.password = hash;
            }else{
              this.toastService.presentToast("Las contraseñas no coinciden", "myToast", 2000, "primary");
            }
          }
        }
      ]
    });

    await alert.present();
  }

  public async confirmChanges(){
    this.loadService.cargarLoading();
    try{
      this.user.orders = [];
      this.usuarioService.updateUser(this.user);
      this.authService.user = await this.usuarioService.getUser(this.authService.user.id);
      this.toastService.presentToast("Usuario cambiado correctamente", "myToast", 2000, "primary");
      this.loadService.pararLoading();
    }catch(err){
      console.log(err);
      this.toastService.presentToast("El usuario no se ha podido cambiar satisfactoriamente", "myToast", 2000, "primary");
      this.loadService.pararLoading();
    }

    this.modalController.dismiss();
    
  }

  public backButton(){
    this.modalController.dismiss();
  }

  

}
