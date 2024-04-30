import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ViewController,
    ModalController
} from 'ionic-angular';
import { DefectObjectsPage } from '../modal/defect-objects/defect-objects';

/**
 * Generated class for the CommonDefectObjectsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-common-defect-objects',
    templateUrl: 'common-defect-objects.html'
})
export class CommonDefectObjectsPage {
    defectObjects = [];
    editable: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private modalCtrl: ModalController
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad CommonDefectObjectsPage');
        this.defectObjects = this.navParams.get('defectObjects');
        this.editable = this.navParams.get('editable') === false ? false : true;
    }

    close() {
        this.viewCtrl.dismiss();
    }

    deleteDefectObject(event, index) {
        if (!this.editable) {
            return;
        }
        this.defectObjects.splice(index, 1);
    }

    addObjects() {
        if (!this.editable) {
            return;
        }
        const modal = this.modalCtrl.create(
            DefectObjectsPage,
            {},
            {
                cssClass: 'commonModal defectObjectModal',
                showBackdrop: true,
                enableBackdropDismiss: true
            }
        );
        modal.onDidDismiss((data) => {
            if (data) {
                this.defectObjects.push(data.value);
            } else {
            }
        });
        modal.present();
    }

    commitObjects() {
        if (!this.editable) {
            this.viewCtrl.dismiss();
            return;
        }
        this.viewCtrl.dismiss({ value: this.defectObjects });
    }
}
