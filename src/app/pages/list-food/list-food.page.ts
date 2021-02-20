import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Food } from 'src/app/model/Food';
import { ApiFoodService } from 'src/app/services/api-food.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-list-food',
  templateUrl: './list-food.page.html',
  styleUrls: ['./list-food.page.scss'],
})
export class ListFoodPage implements OnInit {

  public allFood:Food[] = [];
  public allFoodSearch:Food[] = [];

  constructor(private modalController:ModalController, private loadService: LoadingService, private foodService: ApiFoodService) { 
  }

  async ngOnInit() {
    await this.loadService.cargarLoading()
    this.allFood = await this.foodService.getAllFood();
    console.log(this.allFood);
    this.initializeItems();
    setTimeout(() => {
      this.loadService.pararLoading();
    }, 1000);
  }

  initializeItems(){
    this.allFoodSearch = this.allFood;
  }

  getItems(ev:any){
    this.initializeItems();
    let val = ev.target.value;

    if(val && val.trim() != ""){
      this.allFoodSearch = this.allFoodSearch.filter((food)=>{
        return (food.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  public async cargaDatos($event=null){
    await this.loadService.cargarLoading();
    this.allFood = await this.foodService.getAllFood();
    setTimeout(() => {
      this.loadService.pararLoading();
    }, 1000);
    if($event){
      $event.target.complete();
    }
  }

  public selectFood(food:Food){
    this.modalController.dismiss(food);
  }

  public backButton(){
    this.modalController.dismiss();
  }

}
