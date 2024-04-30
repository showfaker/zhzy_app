import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';

/**
 * Generated class for the InventorisMenusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventoris-menus',
  templateUrl: 'inventoris-menus.html',
})
export class InventorisMenusPage {
  warehouseId: any;
  warehouseName: any;
  materialId: any;
  materialNo: any;
  showQrcode: any = true;
  materialType: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.showQrcode = this.navParams.get('showQrcode') === false ? false : true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventorisMenusPage');
    this.materialType = this.navParams.get('materialType') || '01';
  }

  ionViewWillEnter() {}

  inventorisOutIn(event, type) {
    this.viewCtrl.dismiss({ type, materialType: this.materialType });
  }

  scanQrcode() {
    this.viewCtrl.dismiss({ type: 'qrcode' });
  }
}
