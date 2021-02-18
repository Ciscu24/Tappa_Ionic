import { Component, Renderer2 } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PedidoPage } from './pages/pedido/pedido.page';
import { NONE_TYPE } from '@angular/compiler';
import { AuthService } from './services/auth.service';
import { InfoPage } from './pages/info/info.page';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private themeService: ThemeService,
    private modalController: ModalController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.init();
    });
  }

  async changeInfo() {
    const modal = await this.modalController.create({
      component: InfoPage,
    });
    return await modal.present();
  }

  public enableDark(){
    this.themeService.enableDark();
  }
}
