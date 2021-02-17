import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Food } from 'src/app/model/Food';
import { Order } from 'src/app/model/Order';

@Component({
  selector: 'app-pedido-realizado',
  templateUrl: './pedido-realizado.page.html',
  styleUrls: ['./pedido-realizado.page.scss'],
})
export class PedidoRealizadoPage{

  @Input('order') order:Order;

  public addedFood:Food[] = [];

  public comidaFinal:{
    id: string | number,
    name: string,
    multiplier: number
  }[] = [];

  constructor(private modalController:ModalController) { }

  ngOnInit() {
    this.order.addedFood.forEach((food)=>{
      this.addedFood.push({
        name: food.name,
        price: food.price
      })
    })
    this.recoleccion();
  }

  public backButton(){
    this.modalController.dismiss();
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
