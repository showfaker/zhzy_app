import { MutilService } from './../../../../providers/util/Mutil.service';
import { ActionSheetController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { alarmlogsService } from './../../../../providers/alarmlogs.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CommonCheckMemosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-check-memos',
  templateUrl: 'common-check-memos.html'
})
export class CommonCheckMemosPage {
  memo = null;
  sheetModalOptions = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alarmlogsService: alarmlogsService,
    private actionSheetCtrl: ActionSheetController,
    private mutilservice: MutilService,
    private viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonCheckMemosPage');
    const ruleId = this.navParams.get('ruleId');
    this.alarmlogsService.getCheckmemos(ruleId).subscribe((res: any) => {
      this.sheetModalOptions = res;
    });
  }

  openSheetModal() {
    const options = this.sheetModalOptions;
    const buttons = options.map((item) => {
      return {
        text: item,
        handler: () => {
          this.memo = item;
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

  cancel() {
    this.viewCtrl.dismiss();
  }
  close() {
    this.viewCtrl.dismiss();
  }

  ok() {
    if (!this.memo) {
      this.mutilservice.popToastView('请填写备注说明');
      return;
    } else if (this.memo.length > 500) {
      this.mutilservice.popToastView('备注说明不超过500字符');
      return;
    }
    this.viewCtrl.dismiss({
      type: 'ok',
      value: this.memo
    });
  }
}
