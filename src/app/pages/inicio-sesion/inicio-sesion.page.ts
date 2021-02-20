import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import jsSHA from 'jssha';
import { AppComponent } from 'src/app/app.component';
import { ApiUserService } from 'src/app/services/api-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { ForgetPasswordPage } from '../forget-password/forget-password.page';
import { RegistroPage } from '../registro/registro.page';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})

export class InicioSesionPage{

  public tasks: FormGroup;

  passwordTypeInput = 'password';

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private modalController: ModalController,
    private userService: ApiUserService,
    private menuCtrl: MenuController,
    private loadService: LoadingService,
    private toastService: ToastService) {

    this.tasks = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]]
    })

  }

  async ionViewWillEnter() {
    console.log("Jaja24");
    this.menuCtrl.enable(false);
    if(this.authService.isLogged()){
      try{
        await this.loadService.cargarLoading();
        this.authService.user = await this.userService.getUser(this.authService.user.id);
        console.log("Estoy en el ionViewWillEnter del inicio-sesion.page");
        console.log(this.authService.user);
        this.menuCtrl.enable(true);
        await this.loadService.pararLoading();
        this.router.navigate(['/']);
      }catch(err){
        console.log(err);
        await this.loadService.pararLoading();
      }
    }
  }

  async changeRegistro() {
    const modal = await this.modalController.create({
      component: RegistroPage,
    });
    return await modal.present();
  }

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
  }

  public async login(){
    let email = this.tasks.get("email").value;
    let password = this.tasks.get("password").value;

    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(password);
    let hash = shaObj.getHash("HEX");

    await this.loadService.cargarLoading();
    let u = await this.authService.login(email, hash);
    
    if(u.id!=-1){
      this.menuCtrl.enable(true);
      await this.loadService.pararLoading();
      this.router.navigate(['/']);
    }else{
      await this.loadService.pararLoading();
      this.toastService.presentToast("Usuario no encontrado", "myToast", 2000, "primary");
    }
  }

  public async changeForgetPassword() {
    const modal = await this.modalController.create({
      component: ForgetPasswordPage,
    });
    return await modal.present();
  }

}
