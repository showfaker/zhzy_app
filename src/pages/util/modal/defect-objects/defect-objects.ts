import { MutilService } from './../../../../providers/util/Mutil.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DefectObjectsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-defect-objects',
  templateUrl: 'defect-objects.html'
})
export class DefectObjectsPage {
  objName: any = null;
  objCompany: any = null;
  objProvider: any = null;
  form: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private mutilservice: MutilService,
    private viewCtrl: ViewController
  ) {
    this.form = this.fb.group({
      objName: new FormControl(null),
      objCompany: new FormControl(null),
      objProvider: new FormControl(null)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefectObjectsPage');
  }

  ok() {
    if (!this.form.value.objName) {
      this.mutilservice.popToastView('设备名称必填');
      return;
    }
    this.viewCtrl.dismiss({ value: this.form.value });
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
