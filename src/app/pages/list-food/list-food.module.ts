import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListFoodPageRoutingModule } from './list-food-routing.module';

import { ListFoodPage } from './list-food.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListFoodPageRoutingModule
  ],
  declarations: [ListFoodPage]
})
export class ListFoodPageModule {}
