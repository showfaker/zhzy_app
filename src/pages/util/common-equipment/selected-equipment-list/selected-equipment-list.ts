import { Events } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
/**
 * Generated class for the SelectedEquipmentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-selected-equipment-list',
    templateUrl: 'selected-equipment-list.html'
})
export class SelectedEquipmentListPage {
    selectedItem: any;
    editable: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        private events: Events
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SelectedEquipmentListPage');
        this.selectedItem = this.navParams.get('selectedItem');
        this.editable = this.navParams.get('editable') === false ? false : true;
    }

    deleteSelectedItem(id) {
        if (!this.editable) {
            return;
        }
        let index = _.findIndex(this.selectedItem, (o) => o.deviceId == id);
        this.selectedItem.splice(index, 1);
        this.events.publish('item', [...this.selectedItem]);
        if (this.selectedItem.length === 0) {
            this.viewCtrl.dismiss(null);
        }
    }
}
