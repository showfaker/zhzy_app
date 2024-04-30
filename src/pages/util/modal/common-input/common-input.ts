import { ViewController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CommonInputPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-input',
  templateUrl: 'common-input.html',
})
export class CommonInputPage {
  value: any;
  title: any;
  type: any = 'text';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonInputPage');
    this.title = this.navParams.get('title');
    this.value = this.navParams.get('value');
    this.type = this.navParams.get('type');
  }

  ok() {
    if (!this.value) {
      const alert = this.alertCtrl.create({
        title: '警告',
        subTitle: this.type == 'number' ? `${this.title}请填写数字` : `请输入${this.title}`,
        buttons: ['确认'],
      });
      alert.present();
      return;
    }
    if (this.type == 'number') {
      this.viewCtrl.dismiss({ value: this.value, type: 'ok' });
    } else {
      this.viewCtrl.dismiss({ value: this.value, type: 'ok' });
    }
  }

  clear() {
    this.viewCtrl.dismiss({ value: null, type: 'clear' });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
