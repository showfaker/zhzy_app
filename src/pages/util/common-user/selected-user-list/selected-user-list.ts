import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'page-selected-user-list',
    templateUrl: 'selected-user-list.html'
})
export class SelectedUserListPage {
    selectedItem: any;
    editable: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private events: Events,
        private viewCtrl: ViewController
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SelectedUserListPage');
        this.selectedItem = this.navParams.get('selectedItem');
        this.editable = this.navParams.get('editable') === false ? false : true;
    }

    deleteSelectedItem(userId) {
        if (!this.editable) {
            return;
        }
        let index = _.findIndex(this.selectedItem, (o) => o.userId == userId);
        this.selectedItem.splice(index, 1);
        this.events.publish('user:item', [...this.selectedItem]);
        if (this.selectedItem.length === 0) {
            this.viewCtrl.dismiss(null);
        }
    }
}
