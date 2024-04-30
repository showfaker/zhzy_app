import { MaterialService } from './../../../providers/material.service';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';

/**
 * Generated class for the CommonWarehousePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-warehouse',
  templateUrl: 'common-warehouse.html',
})
export class CommonWarehousePage {
  warehouseList: any[];
  allWarehouses: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private materialservice: MaterialService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonWarehousePage');
    this.allWarehouses = this.navParams.get('allWarehouses');
    this.query();
  }

  close() {
    this.viewCtrl.dismiss(null);
  }

  // 搜索仓库
  searchWarehouse(event) {
    this.query(event.target.value);
  }

  query(warehouseName = null) {
    if (this.allWarehouses === false) {
      this.materialservice
        .getWarehouseList({ warehouseName, allWarehouses: false })
        .subscribe((res) => {
          this.warehouseList = res;
        });
    } else {
      this.materialservice
        .getWarehouseList({ warehouseName })
        .subscribe((res) => {
          this.warehouseList = res;
        });
    }
  }

  selectWarehouse(warehouse) {
    this.viewCtrl.dismiss({ value: warehouse, type: 'ok' });
  }
}
