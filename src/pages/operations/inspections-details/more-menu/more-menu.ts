import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MoreMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-more-menu',
    templateUrl: 'more-menu.html',
})
export class InspectionsMoreMenuPage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad MoreMenuPage');
    }

    inspectionsMenus(event, type) {
        this.viewCtrl.dismiss({ type });
    }
}
