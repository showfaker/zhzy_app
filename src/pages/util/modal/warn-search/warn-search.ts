import { Component } from '@angular/core';
import {
  ModalController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonStationPage } from '../../common-station/common-station';
import { MutilService } from './../../../../providers/util/Mutil.service';
import { EquipmentListPage } from './../../common-equipment/equipmentList';
/**
 * Generated class for the WarnSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-warn-search',
  templateUrl: 'warn-search.html',
})
export class WarnSearchPage {
  station: any;

  customStartPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () =>
          (this.startDate = moment(this.initData.startDate).format()),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  customEndPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.endDate = moment(this.initData.endDate).format()),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  startDate: any;
  endDate: any;
  equipment: any;
  alarmLevels = [];
  alarmTypes = [];
  alarmStatus = [];
  initData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private mutilservice: MutilService,
    private viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WarnSearchPage');
    const initData = this.navParams.get('initData');
    this.initData = { ...initData };
    this.startDate = moment(initData.startDate).format();
    this.endDate = moment(initData.endDate).format();
    this.alarmLevels = initData.aAlarmLevels;
    this.alarmTypes = initData.aAlarmTypes;
    this.alarmStatus = initData.aAlarmStatus;
    this.station = this.navParams.get('station') || null;
    this.equipment = this.navParams.get('equipment') || null;
  }

  ionViewWillEnter() {
    const equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      this.equipment = equipmentList[0];
    }
  }

  // 电站选择
  selectStation() {
    let modal = this.modalCtrl.create(CommonStationPage, {});
    modal.onDidDismiss((e) => {
      if (e) {
        this.station = e;
      }
    });
    modal.present({ keyboardClose: true });
  }

  clearStation(event) {
    event.stopPropagation && event.stopPropagation();
    this.station = null;
  }

  // 电站选择
  selectEquipment() {
    if (!this.station) {
      this.mutilservice.popToastView('请先选择电站！');
      return;
    }
    this.navCtrl.push(EquipmentListPage, {
      isSingle: true,
      stationId: this.station.id,
    });
  }

  clearEquipment(event) {
    event.stopPropagation && event.stopPropagation();
    this.equipment = null;
  }

  selectAlarmLevels(item) {
    item.selected = !item.selected;
    _.unionBy(this.alarmLevels, item, 'id');
  }

  selectAlarmTypes(item) {
    item.selected = !item.selected;
    _.unionBy(this.alarmTypes, item, 'id');
  }

  selectAlarmStatus(item) {
    item.selected = !item.selected;
    _.unionBy(this.alarmStatus, item, 'id');
  }

  reset() {
    this.startDate = moment(this.initData.startDate).format();
    this.endDate = moment(this.initData.endDate).format();
    this.station = null;
    this.equipment = null;
    this.alarmLevels.map((item) => {
      item.selected = false;
    });
    this.alarmTypes.map((item) => {
      item.selected = false;
    });
    this.alarmStatus.map((item) => {
      item.selected = false;
    });
  }

  ok() {
    const alarmLevels = [];
    this.alarmLevels.map((item) => {
      if (item.selected) {
        alarmLevels.push(item.id);
      }
    });
    const alarmTypes = [];
    this.alarmTypes.map((item) => {
      if (item.selected) {
        alarmTypes.push(item.id);
      }
    });
    const alarmStatus = [];
    this.alarmStatus.map((item) => {
      if (item.selected) {
        alarmStatus.push(item.id);
      }
    });
    this.viewCtrl.dismiss({
      queryParams: {
        startDate: this.startDate,
        endDate: this.endDate,
        alarmLevels: alarmLevels,
        alarmTypes: alarmTypes,
        alarmStatus: alarmStatus,
      },
      station: this.station,
      equipment: this.equipment,
    });
  }
}
