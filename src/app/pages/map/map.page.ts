import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, marker, polyline} from "leaflet";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: Map;
  marker:any;
  latLong = [];

  constructor(private geolocation:Geolocation, private modalController: ModalController) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.showMap();
  }

  showMap(){
    this.map = new Map("myMap").setView([37.5140329,-4.6543169], 13);
    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(this.map);
    marker([37.5140329,-4.6543169]).addTo(this.map).bindPopup("Kebab");
  }

  getPositions(){
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true
    }).then((res)=>{
      return this.latLong = [
        res.coords.latitude,
        res.coords.longitude
      ]
    }).then((latLong)=>{
      this.showMaker(latLong);
    })
  }

  showMaker(latLong){
    this.marker = marker(latLong);
    this.marker.addTo(this.map)
    .bindPopup("Estoy aqui");
  }

  public backButton(){
    this.modalController.dismiss();
  }

}
