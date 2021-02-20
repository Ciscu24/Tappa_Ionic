import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/model/User';
import jsSHA from 'jssha';
import { ApiUserService } from 'src/app/services/api-user.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  public tasks: FormGroup;
  public allUsers:User[] = [];
  public user:User;

  constructor(private formBuilder: FormBuilder, 
    private userService:ApiUserService,
    private loadService: LoadingService,
    private toastService: ToastService,
    private alertController: AlertController,
    private modalController:ModalController) { 
      this.tasks = this.formBuilder.group({
        name: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
        surnames: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
        email: ['', [Validators.required, Validators.email]]
    })
  }

  async ngOnInit() {
    this.loadService.cargarLoading();
    try{
      this.allUsers = await this.userService.getAllUsers();
      setTimeout(()=>{
        this.loadService.pararLoading();
      }, 500)
    }catch(err){
      console.log(err);
      setTimeout(()=>{
        this.loadService.pararLoading();
      }, 500)
    }
  }

  public async changePassword(){
    let aux = false;
    let name = this.tasks.get("name").value;
    let surnames = this.tasks.get("surnames").value;
    let email = this.tasks.get("email").value;

    this.allUsers.forEach((user)=>{
      console.log("hola");
      if(user.name.toLowerCase()==name.toLowerCase() && user.surnames.toLowerCase()==surnames.toLowerCase() && user.email==email){
        aux = true;
        console.log("adios");
        this.user = user;
      }
    })

    console.log(aux);

    if(aux){
      this.changePasswordAlert();
    }else{
      this.toastService.presentToast("Los credenciales no coinciden con ningun usuario", "myToast", 2000, "primary")
    }

  }

  public async changePasswordAlert(){
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
          handler: async(data) => {
            if(data.password == data.passwordConfirm){
              this.loadService.cargarLoading();
              try{
                let shaObj = new jsSHA("SHA-256", "TEXT");
                shaObj.update(data.password);
                let hash = shaObj.getHash("HEX");
                this.user.password = hash;
                this.user.orders = [];
                await this.userService.updateUser(this.user);
                this.toastService.presentToast("Contraseña cambiada correctamente", "myToast", 2000, "primary");
                this.loadService.pararLoading();
                this.modalController.dismiss();
              }catch(err){
                console.log(err);
                this.toastService.presentToast("La contraseña no se ha podido cambiar satisfactoriamente", "myToast", 2000, "primary");
                this.loadService.pararLoading();
              }
            }else{
              this.toastService.presentToast("Las contraseñas no coinciden", "myToast", 2000, "primary");
            }
          }
        }
      ]
    });

    await alert.present();
  }

  public backButton(){
    this.modalController.dismiss();
  }


}
