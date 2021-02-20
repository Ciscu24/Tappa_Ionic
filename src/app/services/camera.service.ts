import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  public dataBase64:string = 'data:image/jpeg;base64,'

  constructor(private camera: Camera, private alertController: AlertController) { } 

  public async getCamera():Promise<string>{
    return this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation: true
    }).then((res)=>{
      return res;
    }).catch(e => {
      console.log(e);
    })
  }

  public async getGallery():Promise<string>{
    return this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation: true
    }).then((res)=>{
      return res;
    }).catch(e => {
      console.log(e);
    })
  }

  public async showAlertImage():Promise<Promise<string>>{
    let image:string = "";

    const alert = await this.alertController.create({
      header: 'Cambiar Foto',
      buttons: [
        {
          text: 'Camara',
          handler: async() => {
            image = await this.getCamera();
          }
        },
        {
          text: 'Galeria',
          handler: async() => {
            image = await this.getGallery();
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

    console.log(image);
    return image;

  }
}
