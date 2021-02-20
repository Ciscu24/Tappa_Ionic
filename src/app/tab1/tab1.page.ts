import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { ApiUserService } from '../services/api-user.service';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { RoomTappaService } from '../services/room-tappa.service';
import { Order } from '../model/Order';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { PedidoPage } from '../pages/pedido/pedido.page';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  public listOrders: Order[] = [];
  public street:string = "";

  constructor(
    private apiUser:ApiUserService, 
    private room: RoomTappaService,
    private alertController: AlertController,
    private modal: ModalController,
    private cameraService: CameraService,
    private authService: AuthService) { 
      
      room.getRoom().forEach((data)=>{
        this.listOrders = [];
        data.forEach((data)=>{
          if(data.boss.image ==  "" || data.boss.image == null){
            data.boss.image = "assets/user_default.png";
          }else{
            data.boss.image = this.cameraService.dataBase64 + data.boss.image;
          }
          this.listOrders.push({
            $key: data.$key,
            id: data.id,
            street: data.street,
            date: data.date,
            boss: data.boss,
            users: data.users,
            addedFood: data.addedFood
          });
        })
        console.log(this.listOrders);
      })
    }
    
  async alertStreet() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Introduce tu calle:',
      inputs: [
        {
          name: 'calle',
          type: 'text',
          placeholder: 'Calle'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.street = data.calle;
            this.addRoom();
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
  }

  public async selectRoom(key:string){
    const modal = await this.modal.create({
      component: PedidoPage,
      componentProps: { key: key }
    });

    await modal.present();
  }

  public async addRoom(){
    this.authService.user = await this.apiUser.getUser(this.authService.user.id);
    if(this.street!=""){
      let o:Order = {
        street: this.street,
        date: Date.now().toString(),
        boss: this.authService.user,
        users: [
          this.authService.user
        ],
        addedFood: [],
        finishOrder: false
      }
      let keyOrder = this.room.addRoom(o).key;
  
      const modal = await this.modal.create({
        component: PedidoPage,
        componentProps: { key: keyOrder }
      });

      this.street = "";
  
      await modal.present();
    }
  }

}
