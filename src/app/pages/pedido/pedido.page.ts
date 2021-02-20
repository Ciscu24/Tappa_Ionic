import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Order } from 'src/app/model/Order';
import { Food } from 'src/app/model/Food';
import { RoomTappaService } from 'src/app/services/room-tappa.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ListFoodPage } from '../list-food/list-food.page';
import { ApiOrderService } from 'src/app/services/api-order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Identifiers } from '@angular/compiler';
import { ApiUserService } from 'src/app/services/api-user.service';
import { User } from 'src/app/model/User';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit, OnDestroy{

  @Input('key') key:string;
  order:Order = {
    street: "",
    date: "",
    addedFood: []
  };

  public userShipping:User;
  public userCall:User;

  public buttonFinishOrder:boolean = false;

  public totalPrice:number = 0;

  public addedFood:Food[] = [];

  public comidaFinal:{
    id: string | number,
    name: string,
    multiplier: number
  }[] = [];

  constructor(private modalController:ModalController, 
    private room:RoomTappaService, 
    private authService: AuthService,
    private loadService: LoadingService, 
    private userService: ApiUserService,
    private alertController: AlertController,
    private toastService: ToastService,
    private orderService:ApiOrderService) {
  }

  async ionViewWillEnter(){
    console.log(this.key);
    this.authService.user = await this.userService.getUser(this.authService.user.id);
    console.log(this.authService.user);
    await this.room.getRoom().forEach(async(room)=>{
      //await this.loadService.cargarLoading();
      room.forEach((orderI)=>{
        if(this.key==orderI.$key){
          if(orderI.addedFood!=null){
            this.order = {
              $key: orderI.$key,
              id: orderI.id,
              street: orderI.street,
              date: orderI.date,
              boss: orderI.boss,
              users: orderI.users,
              addedFood: orderI.addedFood,
              finishOrder: orderI.finishOrder
            }
          }else{
            this.order = {
              $key: orderI.$key,
              id: orderI.id,
              street: orderI.street,
              date: orderI.date,
              boss: orderI.boss,
              users: orderI.users,
              addedFood: [],
              finishOrder: orderI.finishOrder
            }
          }
          
        }
      })
      if(this.order.finishOrder === true){
        this.loadService.cargarLoading();
        setTimeout(() => {
          this.order = null;
          this.loadService.pararLoading();
          this.modalController.dismiss();
         }, 1000);
      }
      this.totalPrice = 0;
      this.calculateTotalPrice();
      this.addedFood = [];
      this.comidaFinal = [];
      if(this.order.addedFood!=[]){
        this.order.addedFood.forEach((food)=>{
          this.addedFood.push({
            id: food.id,
            name: food.name,
            price: food.price
          })
        })
      }
      if(this.addFood!={}){
        this.recoleccion();
      }
      //this.loadService.pararLoading();
      this.buttonActiveForBoss();
      console.log(this.order);
    })
  }

  ngOnInit() {
  }

  public async addFood(){

    let food:Food = {
      name: "",
      price: 0
    };

    const modal = await this.modalController.create({
      component: ListFoodPage
    });

    await modal.present();
    
    await modal.onDidDismiss()
      .then((data) => {
        food = data.data
    });

    if(food != null){
      this.order.addedFood.push(food);
      let userInRoom:boolean = false;
      this.order.users.forEach((data)=>{
        if(data.id==this.authService.user.id){
          userInRoom = true;
        }
      })
      if(userInRoom==false){
        this.order.users.push(this.authService.user);
      }
      this.room.editRoom(this.order);
    }
  }

  public deleteFood(id:string | number){
    let aux:boolean = true;
    let index = 0;
    while(index<=(this.order.addedFood.length-1) && aux){
      if(this.order.addedFood[index].id == id){
        this.order.addedFood.splice(index, 1);
        aux = false;
      }
      index++;
    }
    this.room.editRoom(this.order);
  }

  public async finishOrder(){
    this.loadService.cargarLoading();
    this.orderService.createOrder(this.order);
    this.order.finishOrder = true;

    let allUsers:User[] = [];
    allUsers = await this.userService.getAllUsers();

    this.order.users.forEach((data)=>{
      let index = 0;
      while(index<=(allUsers.length-1)){
        if(allUsers[index].id == data.id){
          this.userService.updateCallAndShipping(
            allUsers[index].id, 
            allUsers[index].call+2, 
            allUsers[index].shipping+2)
          //Se suma 2
        }else{
          this.userService.updateCallAndShipping(
            allUsers[index].id, 
            allUsers[index].call+1, 
            allUsers[index].shipping+1)
          //Se suma 1
        }
        index++;
      }
    })
    this.room.editRoom(this.order);
    this.userCall.shipping += 2;
    this.userShipping.call += 2;
    this.userCall.call = 0;
    this.userShipping.shipping = 0;
    this.userService.updateCallAndShipping(this.userCall.id, this.userCall.call, this.userCall.shipping);
    this.userService.updateCallAndShipping(this.userShipping.id, this.userShipping.call, this.userShipping.shipping);
    setTimeout(() => {
      this.room.deleteRoom(this.key);
      this.loadService.pararLoading();
      this.modalController.dismiss();
     }, 1000);

     this.toastService.presentToast("Pedido realizado con exito", "myToast", 2000, "primary");
    
  }

  public calculateUserCallAndShipping(){
    console.log("hola");
    let shippingFinal:number = 0;
    let callFinal:number = 0;
    this.order.users.forEach((data)=>{
      if(data.shipping>=shippingFinal){
        this.userShipping = data;
        shippingFinal = data.shipping;
        console.log(data);
        console.log(shippingFinal);
      }
      if(data.call>=callFinal){
        this.userCall = data;
        callFinal = data.call;
        console.log(data);
        console.log(callFinal);
      }
    })
  }

  public async showUserCallAndShipping(){
    this.calculateUserCallAndShipping();
    const alert = await this.alertController.create({
      header: 'Llamada y Envio',
      message: "La llamada le toca a: <br/>" + this.userCall.name + " " + this.userCall.surnames + "<br/>"
      + "El envio le toca a: <br/>" + this.userShipping.name + " " + this.userShipping.surnames,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: async() => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Cambiar',
          handler: async() => {
            await this.selectUserCallAndShipping();
            await this.finishOrder();
          }
        },
        {
          text: 'Confirmar',
          handler: async() => {
            console.log('Confirm clicked');
            await this.finishOrder();
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
  }

  public async selectUserCallAndShipping(){

    let idCall:number | string = 0;

    let alertPropertiesCall = {
      cssClass: 'my-custom-class',
      header: 'Cambiar usuario para llamar',
      inputs: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            idCall = this.userCall.id;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            idCall = data;
          }
        }
      ]
    };

    this.order.users.forEach((data)=>{
      alertPropertiesCall.inputs.push(
        {
          type: 'radio',
          label: data.name + " " + data.surnames,
          name: data.email,
          value: data.id
        }
        );
    })

    const alertCall = await this.alertController.create(alertPropertiesCall);

    alertCall.present();
    await alertCall.onDidDismiss();

    let idShipping:number | string = 0;

    let alertPropertiesShipping = {
      cssClass: 'my-custom-class',
      header: 'Cambiar usuario para pagar el envio',
      inputs: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            idShipping = this.userShipping.id;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            idShipping = data;
          }
        }
      ]
    };

    this.order.users.forEach((data)=>{
      alertPropertiesShipping.inputs.push(
        {
          type: 'radio',
          label: data.name + " " + data.surnames,
          name: data.email,
          value: data.id
        }
        );
    })

    const alertShipping = await this.alertController.create(alertPropertiesShipping);

    alertShipping.present();
    await alertShipping.onDidDismiss();

    this.userCall = await this.userService.getUser(idCall);
    this.userShipping = await this.userService.getUser(idShipping);

  }
  
  public buttonActiveForBoss(){
    if(this.order.boss.id == this.authService.user.id){
      this.buttonFinishOrder = false;
    }else{
      this.buttonFinishOrder = true;
    }
  }

  public backButton(){
    if(this.authService.user.id == this.order.boss.id){
      this.loadService.cargarLoading();
      this.order.finishOrder = true;
      this.room.editRoom(this.order);
      setTimeout(() => {
        this.room.deleteRoom(this.key);
        this.loadService.pararLoading();
        this.modalController.dismiss();
       }, 1000);
    }
    this.modalController.dismiss();
  }

  public calculateTotalPrice(){
    this.order.addedFood.forEach((date)=>{
      this.totalPrice += date.price;
    })
  }

  async ionViewDidLeave(){
    console.log("ionViewDidLeave de pedido.page")
    this.authService.user = await this.userService.getUser(this.authService.user.id);
    this.loadService.pararLoading();
  }

  ngOnDestroy(){
    this.loadService.pararLoading();
  }

  public recoleccion(){
    let allFood = this.addedFood;
    let index = allFood.length - 1;

    while(index >= 0){
      index = allFood.length - 1;
      let counter: number = 0;
      let name: string = "";
      let id: string | number = "";

      for(let order01 of allFood){
        if(allFood[index].name === order01.name){
          counter++;
          name = allFood[index].name;
          id = allFood[index].id;
        }
      }
      if(name!="" && counter!=0){
        this.comidaFinal.push({
          id: id,
          name: name,
          multiplier: counter
        })
  
        allFood = this.quitarObjetos(allFood, name);
      }
      index -= 1;
    }
  }

  public quitarObjetos(foodArray:Food[], nameFood:string){
    let index = foodArray.length - 1;
    while(index >= 0){
      if(foodArray[index].name === nameFood){
        foodArray.splice(index, 1);
      }
      index -= 1;
    }
    return foodArray;
  }

}
