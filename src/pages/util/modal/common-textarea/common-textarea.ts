import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController
} from 'ionic-angular';

/**
 * Generated class for the CommonTextareaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-textarea',
  templateUrl: 'common-textarea.html'
})
export class CommonTextareaPage {
  title: any;
  value: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonTextareaPage');
    this.title = this.navParams.get('title');
    this.value = this.navParams.get('value');
  }

  ok() {
    if (!this.value) {
      const alert = this.alertCtrl.create({
        title: '警告',
        subTitle: `请输入${this.title}`,
        buttons: ['确认']
      });
      alert.present();
      return;
    }
    this.viewCtrl.dismiss({ value: this.value, type: 'ok' });
  }

  clear() {
    this.viewCtrl.dismiss({ value: '', type: 'clear' });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
