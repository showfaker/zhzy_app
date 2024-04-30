import { InspectionsProvider } from './../../../../providers/inspections.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the InspectionsMenusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-inspections-menus',
    templateUrl: 'inspections-menus.html',
})
export class InspectionsMenusPage {
    warehouseId: any;
    warehouseName: any;
    materialId: any;
    materialNo: any;
    inspectionsTypes: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        private inspectionsprovider: InspectionsProvider
    ) {
        this.inspectionsprovider.getInspectionsTypes().subscribe((res) => {
            this.inspectionsTypes = res;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad inspectionsMenusPage');
    }

    ionViewWillEnter() {}

    addInspection(event, type) {
        this.viewCtrl.dismiss({ type });
    }
}
