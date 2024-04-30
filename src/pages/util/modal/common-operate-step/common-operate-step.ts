import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController
} from 'ionic-angular';
import moment from 'moment';

/**
 * Generated class for the CommonOperateStepPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-operate-step',
  templateUrl: 'common-operate-step.html'
})
export class CommonOperateStepPage {
  taskDesc;
  executeTime;

  customExecuteTimePickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.executeTime = null)
      }
    ],
    cssClass: 'hiddenCancelButton'
  };
  type: any;
  form;
  value: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private fb: FormBuilder,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      taskId: new FormControl(null),
      ticketId: new FormControl(null),
      orderNo: new FormControl(null),
      taskDesc: new FormControl(null),
      taskStatus: new FormControl(null),
      executeTime: new FormControl(null)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonOperateStepPage');
    this.type = this.navParams.get('type');
    this.value = this.navParams.get('value');
    console.log(this.value);
    if (this.value.executeTime) {
      this.value.executeTime = moment(this.value.executeTime).format();
    }
    this.form.patchValue(this.value);
  }

  clearItem() {
    this.viewCtrl.dismiss({
      type: 'clear',
      value: null
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }

  deleteItem() {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定删除此步骤么？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.viewCtrl.dismiss({
              type: 'delete',
              value: null
            });
          }
        }
      ]
    });
    confirm.present();
  }

  ok() {
    if (this.type === 'add') {
      this.viewCtrl.dismiss({
        type: 'ok',
        value: this.form.value
      });
    } else {
      this.viewCtrl.dismiss({
        type: 'editOk',
        value: this.form.value
      });
    }
  }
}
