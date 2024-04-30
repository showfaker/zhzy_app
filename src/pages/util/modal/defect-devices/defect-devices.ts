import { FormBuilder, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
} from 'ionic-angular';
import { EquipmentListPage } from '../../common-equipment/equipmentList';
import * as _ from 'lodash';
/**
 * Generated class for the DefectDevicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 新增设备
 */

@Component({
  selector: 'page-defect-devices',
  templateUrl: 'defect-devices.html',
})
export class DefectDevicesPage {
  form: any;
  stationId: any;
  value: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      objNo: new FormControl(null),
      objId: new FormControl(null),
      deviceNo: new FormControl(null),
      objName: new FormControl(null),
      psrId: new FormControl(null),
      objCompany: new FormControl(null),
      objProvider: new FormControl(null),
      objClass: new FormControl(null),
      objClassName: new FormControl(null),
      workHours: new FormControl(null),
      lossEnergy: new FormControl(null),
      objCost: new FormControl(null),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefectDevicesPage');
    this.stationId = this.navParams.get('stationId');
    this.value = this.navParams.get('value');
    if (this.value) {
      this.form.patchValue(this.value);
    }
  }

  ionViewWillEnter() {
    const equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      this.navParams.data.equipmentList = [];
      if (equipmentList.length === 1) {
        this.form.patchValue({
          objNo: null,
          deviceNo: null,
          objCompany: null,
          objProvider: null,
          objClass: null,
          objClassName: null,
          workHours: null,
          lossEnergy: null,
          objCost: null,
          objId: equipmentList[0].deviceId,
          objName: equipmentList[0].deviceName,
          psrId: equipmentList[0].psrId,
          deviceType: equipmentList[0].deviceType,
        });
      } else if (equipmentList.length === 0) {
        this.form.patchValue({
          objNo: null,
          objId: null,
          deviceNo: null,
          objName: null,
          psrId: null,
          objCompany: null,
          objProvider: null,
          objClass: null,
          objClassName: null,
          workHours: null,
          lossEnergy: null,
          objCost: null,
        });
      }
    }
  }

  selectEquipment() {
    this.navCtrl.push(EquipmentListPage, {
      stationId: this.stationId,
      isSingle: true,
      deviceId: this.form.value.objId || null,
      deviceName: this.form.value.objName || null,
    });
  }

  ok() {
    const value = this.form.value;
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (key === 'objId' && !value[key]) {
          let alert = this.alertCtrl.create({
            title: '提示',
            subTitle: '设备不能为空',
            buttons: ['关闭'],
          });
          alert.present();
          return;
        } else if (key === 'workHours') {
          if (_.isNaN(+value[key])) {
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '工作量请填写数字',
              buttons: ['关闭'],
            });
            alert.present();
            return;
          } else {
            value[key] = Math.floor(+value[key] * 100) / 100;
          }
        } else if (key === 'lossEnergy') {
          if (_.isNaN(+value[key])) {
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '损失电量请填写数字',
              buttons: ['关闭'],
            });
            alert.present();
            return;
          } else {
            value[key] = Math.floor(+value[key] * 100) / 100;
          }
        } else if (key === 'objCost') {
          if (_.isNaN(+value[key])) {
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '消缺费用请填写数字',
              buttons: ['关闭'],
            });
            alert.present();
            return;
          } else {
            value[key] = Math.floor(+value[key] * 100) / 100;
          }
        }
      }
    }
    this.viewCtrl.dismiss({ value, type: 'ok' });
  }

  clear() {
    // console.log(this.form)
    this.viewCtrl.dismiss({ value: null, type: 'clear' });
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
