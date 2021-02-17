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

  constructor(private modalController:ModalController, private loadService: LoadingService, private foodService: ApiFoodService) { 
  }

  async ngOnInit() {
    this.allFood = await this.foodService.getAllFood();
    console.log(this.allFood);
  }

  public selectFood(food:Food){
    this.modalController.dismiss(food);
  }

  public backButton(){
    this.modalController.dismiss();
  }

}
