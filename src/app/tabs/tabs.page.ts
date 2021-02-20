import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild('myTabs') tabs: IonTabs;

  public imageTappa = "assets/logoWhite.png"

  constructor() {
  }

  getSelectedTab(): void {
    let tab:string = this.tabs.getSelected();
    if(tab == "tab1"){
      this.imageTappa = "assets/logoBlack.png";
    }else{
      this.imageTappa = "assets/logoWhite.png";
    }
  }

}
