import { MaintainsProvider } from '../../../../providers/maintains.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MaintainsMenusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-maintains-menus',
    templateUrl: 'maintains-menus.html',
})
export class MaintainsMenusPage {
    warehouseId: any;
    warehouseName: any;
    materialId: any;
    materialNo: any;
    maintainTypes: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        private maintainsprovider: MaintainsProvider
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad maintainsMenusPage');
        this.maintainsprovider.getMaintainsTypes().subscribe((res) => {
            console.log(res);
            this.maintainTypes = res;
        });
    }

    ionViewWillEnter() {}

    addMaintains(event, type) {
        this.viewCtrl.dismiss({ type });
    }
}
