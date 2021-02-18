import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  public backButton(){
    this.modalController.dismiss();
  }

}
