import { Component, Renderer2 } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PedidoPage } from './pages/pedido/pedido.page';
import { NONE_TYPE } from '@angular/compiler';
import { AuthService } from './services/auth.service';
import { InfoPage } from './pages/info/info.page';
import { ThemeService } from './services/theme.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ConfigPage } from './pages/config/config.page';
import { MapPage } from './pages/map/map.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public darkModeBoolean:boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private nativeStorage: NativeStorage,
    private themeService: ThemeService,
    private modalController: ModalController,
  ) {
    this.initializeApp();
    setTimeout(()=>{
      this.cargarDarkMode();
    }, 1000)
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.init();
    });
  }

  public async cargarDarkMode(){
    this.darkModeBoolean = await this.nativeStorage.getItem("darkModeTappa");
    console.log(this.darkModeBoolean);
  }

  public async changeTheme(event){
    if(event.detail.checked){
      this.themeService.enableDark();
      this.darkModeBoolean = true;
      await this.nativeStorage.setItem("darkModeTappa", true);
      console.log(await this.nativeStorage.getItem("darkModeTappa"));
      console.log("Negro")
    }else{
      this.themeService.enableLight();
      this.darkModeBoolean = false;
      await this.nativeStorage.setItem("darkModeTappa", false);
      console.log(await this.nativeStorage.getItem("darkModeTappa"));
      console.log("Blanco");
    }
  }

  
  async changeInfo() {
    const modal = await this.modalController.create({
      component: InfoPage,
    });
    return await modal.present();
  }

  async changeConfig() {
    const modal = await this.modalController.create({
      component: ConfigPage,
    });
    return await modal.present();
  }

  async changeMap() {
    const modal = await this.modalController.create({
      component: MapPage,
    });
    return await modal.present();
  }
}
