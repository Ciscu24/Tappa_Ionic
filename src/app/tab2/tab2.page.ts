import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from '../model/Order';
import { PedidoRealizadoPage } from '../pages/pedido-realizado/pedido-realizado.page';
import { ApiOrderService } from '../services/api-order.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public listado:Array<Order>;

  constructor(
    private apiOrder:ApiOrderService, 
    private authService: AuthService,
    private loadService: LoadingService,
    private modalController: ModalController
    ) {}

  async ionViewWillEnter(){
    await this.loadService.cargarLoading();
    try{
      this.listado = await this.apiOrder.getOrdersByUserId(this.authService.user.id);
      this.listado.forEach(async(order)=>{
        //order.price = await this.apiOrder.getAllPriceForOrder(order.id);
        let p = 0;
        for(let food of order.addedFood){
          p = p + food.price;
        }
        order.price = p;
      }
      )
    }catch(error){
      console.log(error);
      this.listado = null;
    }
    await this.loadService.pararLoading();
  }

  public async seeOrder(order:Order){
    const modal = await this.modalController.create({
      component: PedidoRealizadoPage,
      cssClass: 'my-custom-class',
      componentProps:{
        order:order
      }
    });
    modal.present();

    /*return modal.onDidDismiss()
    .then(()=>{
      this.cargaDatos();
    });*/
  }

}
