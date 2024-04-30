import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController,
  AlertController
} from 'ionic-angular';
import { CommonStationPage } from '../../common-station/common-station';
import * as moment from 'moment';

/**
 * Generated class for the JobRecordSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-job-record-search',
  templateUrl: 'job-record-search.html'
})
export class JobRecordSearchPage {
  station: any = null;
  startTime: any = null;
  endTime: any = null;
  stationId: any;
  stationName: any;

  customStartPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.startTime = null)
      }
    ],
    cssClass: 'hiddenCancelButton'
  };
  customEndPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.endTime = null)
      }
    ],
    cssClass: 'hiddenCancelButton'
  };
  status: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobRecordSearchPage');
    this.stationId = this.navParams.get('stationId');
    this.stationName = this.navParams.get('stationName');
    this.startTime = this.navParams.get('startTime') || moment().format('YYYY-MM-DD');
    this.endTime = this.navParams.get('endTime') || moment().format('YYYY-MM-DD');
    this.status = this.navParams.get('status');
    if (this.stationId && this.stationName) {
      this.station = {
        id: this.stationId,
        title: this.stationName
      };
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

  cancelDateTime(event, type) {
    console.log(event, type);
  }

  selectStatus(type) {
    if (type !== this.status) {
      this.status = type;
    }
  }

  ok() {
    const params = {
      stationId: this.station ? this.station.id : null,
      stationName: this.station ? this.station.title : null,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status
    };
    if (
      this.startTime &&
      this.endTime &&
      moment(this.startTime).valueOf() > moment(this.endTime).valueOf()
    ) {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '所选时间范围不正确',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.viewCtrl.dismiss({ value: params, type: 'ok' });
  }


  reset() {
    this.station = null;
    this.startTime = moment().format('YYYY-MM-DD');
    this.endTime = moment().format('YYYY-MM-DD');
    this.status = 1;
    // this.viewCtrl.dismiss({ value: null, type: 'reset' });
  }
}
