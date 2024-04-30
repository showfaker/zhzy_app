import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import { MaterialService } from '../../../providers/material.service';

/**
 * Generated class for the CommonIotypesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-iotypes',
  templateUrl: 'common-iotypes.html',
})
export class CommonIotypesPage {
  ioTypesOptions: any;
  triggleParent: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private materialservice: MaterialService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonIotypesPage');
    const ioSubTypes = this.navParams.get('ioSubTypes') || [];
    const materialType = this.navParams.get('materialType');
    this.materialservice
      .getmaterialsIoTypes({ materialType })
      .subscribe((res) => {
        this.ioTypesOptions = res;
        this.ioTypesOptions.map((item) => {
          item.children.map((child) => {
            if (ioSubTypes.includes(child.first)) {
              child.checked = true;
            }
          });
          item.checked = item.children.every((child) => child.checked);
        });
      });
  }

  updateChildrenItems(event, value) {
    if (this.triggleParent) {
      return;
    }
    this.ioTypesOptions.map((item) => {
      if (item.first === value) {
        item.children.map((child) => {
          child.checked = event.checked;
        });
      }
    });
  }

  checkedAll(parent) {
    this.triggleParent = true;
    parent.checked = parent.children.every((item) => item.checked);
  }

  close() {
    this.viewCtrl.dismiss(null);
  }

  cancel() {
    this.ioTypesOptions.map((item) => {
      // item.checked = false;
      item.children.map((child) => {
        child.checked = false;
      });
    });
    // this.viewCtrl.dismiss({ type: 'clear', value: [] });
  }

  save() {
    const checkedItem = [];
    this.ioTypesOptions.map((item) => {
      item.children.map((child) => {
        if (child.checked) {
          checkedItem.push(child.first);
        }
      });
    });
    this.viewCtrl.dismiss({ type: 'ok', value: checkedItem });
  }
}
