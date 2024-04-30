import { MutilService } from './../../../../providers/util/Mutil.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CommonRadioTextareaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-radio-textarea',
  templateUrl: 'common-radio-textarea.html',
})
export class CommonRadioTextareaPage {
  item: any;
  itemProps: any;
  itemMemo: any;
  itemValue: any;
  prevItemValue: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mutilservice: MutilService,
    private viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonRadioTextareaPage');
    this.item = this.navParams.get('item');
    this.itemProps = this.item.props;
    this.prevItemValue = this.item.itemValue;
    this.itemValue = this.item.itemValue;
    this.itemMemo = this.item.itemMemo;
  }

  ok() {
    if (
      this.item.prevItemValue !== this.itemValue &&
      this.itemValue !== this.item.defaultValue &&
      !this.itemMemo
    ) {
      return this.mutilservice.popToastView('备注内容必填');
    }
    this.viewCtrl.dismiss({ value: this.itemValue, memo: this.itemMemo, type: 'ok' });
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
