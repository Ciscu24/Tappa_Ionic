import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoRealizadoPageRoutingModule } from './pedido-realizado-routing.module';

import { PedidoRealizadoPage } from './pedido-realizado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoRealizadoPageRoutingModule
  ],
  declarations: [PedidoRealizadoPage]
})
export class PedidoRealizadoPageModule {}
