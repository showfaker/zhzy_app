import { MutilService } from './../../../../providers/util/Mutil.service';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  ModalController
} from 'ionic-angular';
import { CommonUserPage } from '../../common-user/common-user';

/**
 * Generated class for the CommonDispatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-dispatch',
  templateUrl: 'common-dispatch.html'
})
export class CommonDispatchPage {
  memo: any = '';
  options: any = [];
  selectedOption: { checkStatus: any; checkStatusText: any } = {
    checkStatus: null,
    checkStatusText: null
  };
  userId: any = '';
  userName: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private mutilservice: MutilService
  ) { }

  ionViewDidLoad() { }

  selectUser() {
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: true
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          console.log(data);
          this.userId = data.value[0] ? data.value[0].userId : null;
          this.userName = data.value[0] ? data.value[0].realName : null;
          console.log(this.userId);
        } else {
          this.userId = null;
          this.userName = null;
        }
      }
    });
    modal.present();
  }

  ok() {
    console.log(this.userId);
    if (!this.userId) {
      this.mutilservice.popToastView('用户必填');
      return;
    }
    if (this.memo.length > 500) {
      this.mutilservice.popToastView('备注，不超过500字符');
      return;
    }
    this.viewCtrl.dismiss({
      value: { nextUserIds: [this.userId], memo: this.memo },
      type: 'ok'
    });
  }

  clear() {
    this.viewCtrl.dismiss();
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
