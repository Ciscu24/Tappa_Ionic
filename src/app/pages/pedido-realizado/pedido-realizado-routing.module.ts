import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoRealizadoPage } from './pedido-realizado.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoRealizadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoRealizadoPageRoutingModule {}
