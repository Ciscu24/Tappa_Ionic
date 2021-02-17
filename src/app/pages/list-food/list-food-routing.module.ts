import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListFoodPage } from './list-food.page';

const routes: Routes = [
  {
    path: '',
    component: ListFoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListFoodPageRoutingModule {}
