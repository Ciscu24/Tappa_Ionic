import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiUserService } from './services/api-user.service';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiOrderService } from './services/api-order.service';
import { ApiFoodService } from './services/api-food.service';
import { InicioSesionPage } from './pages/inicio-sesion/inicio-sesion.page';
import { PedidoPage } from './pages/pedido/pedido.page';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingService } from './services/loading.service';
import { ToastService } from './services/toast.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { RoomTappaService } from './services/room-tappa.service';

import { Camera } from '@ionic-native/camera/ngx';
import { ThemeService } from './services/theme.service';

@NgModule({
  declarations: [AppComponent, PedidoPage],
  entryComponents: [PedidoPage],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [
    ApiUserService,
    ApiOrderService,
    ApiFoodService,
    LoadingService,
    RoomTappaService,
    ToastService,
    ThemeService,
    NativeStorage,
    HTTP,
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
