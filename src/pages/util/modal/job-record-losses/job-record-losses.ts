import { ViewController, ModalController, ActionSheetController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EquipmentListPage } from '../../common-equipment/equipmentList';
import * as moment from 'moment';
/**
 * Generated class for the JobRecordLossesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-job-record-losses',
  templateUrl: 'job-record-losses.html'
})
export class JobRecordLossesPage {
  lossType: any;
  form: FormGroup;
  deviceId: any;
  stationId: any;
  lossDesc: any;
  startTime;
  endTime;
  lossEnergy: any;

  customStartPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => this.form.patchValue({ startTime: null })
      }
    ],
    cssClass: 'hiddenCancelButton'
  };
  customEndPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => this.form.patchValue({ endTime: null })
      }
    ],
    cssClass: 'hiddenCancelButton'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      lossId: new FormControl(null),
      lossType: new FormControl(null),
      lossTypeText: new FormControl(null),
      deviceId: new FormControl(null),
      deviceName: new FormControl(null),
      lossDesc: new FormControl(null),
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      lossEnergy: new FormControl(null),
      memo: new FormControl(null)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobRecordLossesPage');
    this.lossType = this.navParams.get('lossType');
    this.deviceId = this.navParams.get('deviceId');
    this.stationId = this.navParams.get('stationId');
    this.lossDesc = this.navParams.get('lossDesc');
    this.startTime = this.navParams.get('startTime');
    this.endTime = this.navParams.get('endTime');
    this.lossEnergy = this.navParams.get('lossEnergy');
    const value = this.navParams.get('value');
    if (value) {
      this.form.patchValue(value);
    }
  }

  ionViewWillEnter() {
    const equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      this.navParams.data.equipmentList = [];
      if (equipmentList.length === 1) {
        this.form.patchValue({
          deviceId: equipmentList[0].deviceId,
          deviceName: equipmentList[0].deviceName
        });
      } else if (equipmentList.length === 0) {
        this.form.patchValue({
          deviceId: null,
          deviceName: null
        });
      }
    }
  }

  ok() {
    const value = this.form.value;
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (this[key] && !this[key].nullable && value[key] == null) {
          let alert = this.alertCtrl.create({
            title: '提示',
            subTitle: this[key].name + '必填!',
            buttons: ['关闭']
          });
          alert.present();
          return;
        }
      }
    }
    if (value.endTime && value.startTime > value.endTime) {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '所选时间范围不正确',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.form.patchValue({
      memo: value.lossTypeText + value.lossEnergy + 'KWh'
    });
    this.viewCtrl.dismiss({ value: this.form.value, type: 'ok' });
  }

  clear() {
    this.viewCtrl.dismiss({ value: null, type: 'clear' });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  selectEquipment() {
    this.navCtrl.push(EquipmentListPage, {
      stationId: this.stationId,
      isSingle: true,
      deviceId: this.form.value.deviceId,
      deviceName: this.form.value.deviceName
    });
  }

  openSheetModal(type, typeText) {
    const options = this.lossType['props'];
    const buttons = options.map((item) => {
      return {
        text: item.second,
        handler: () => {
          this.form.patchValue({
            lossType: item.first,
            lossTypeText: item.second
          });
          console.log(this.form);
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
}
