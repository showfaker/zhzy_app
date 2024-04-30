import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  ActionSheetController
} from 'ionic-angular';

/**
 * Generated class for the CommonCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-check',
  templateUrl: 'common-check.html'
})
export class CommonCheckPage {
  checkMemo: any = null;
  options: any = [];
  selectedOption: { checkStatus: any; checkStatusText: any } = {
    checkStatus: null,
    checkStatusText: null
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonTextareaPage');
    this.options = this.navParams.get('options');
  }

  checkResult() {
    const options = this.options;
    const buttons = options.map((item) => {
      return {
        text: item.second,
        handler: () => {
          this.selectedOption = {
            checkStatus: item.first,
            checkStatusText: item.second
          };
        }
      };
    });
    const actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: buttons,
      cssClass: 'commonSheet'
    });
    actionSheet.present();
  }

  ok() {
    if (!this.selectedOption.checkStatusText) {
      const alert = this.alertCtrl.create({
        title: '警告',
        subTitle: `检查结果必填`,
        buttons: ['确认']
      });
      alert.present();
      return;
    }
    if (this.checkMemo && this.checkMemo.length > 500) {
      const alert = this.alertCtrl.create({
        title: '警告',
        subTitle: `检查备注，不超过500字符`,
        buttons: ['确认']
      });
      alert.present();
      return;
    }
    this.viewCtrl.dismiss({
      value: { checkStatus: this.selectedOption.checkStatus, checkMemo: this.checkMemo },
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
