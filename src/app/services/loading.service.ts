import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingActivo:boolean = false;

  constructor(public loadingController: LoadingController) { }

  /**
   * Funcion que ejecuta el Loading
   */
  public async cargarLoading() {
    if(!this.loadingActivo){
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: '<ion-img src="/assets/TappaAnimation.gif" style="width: 10%;" alt="loading..."></ion-img>',
        spinner: null
      });
      await loading.present();
      this.loadingActivo = true;
    }
  }

  /**
   * Funcion que detiene el Loading
   */
  public async pararLoading(){
    await this.loadingController.dismiss();
    this.loadingActivo = false;
  }
}
