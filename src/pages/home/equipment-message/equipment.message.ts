import { Component } from '@angular/core';
import echarts from 'echarts';
import { ModalController, NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { EchartsService } from '../../../providers/echarts.service';
import { MonitorService } from '../../../providers/monitor.service';
import { DeviceArchivePage } from '../../device-archive/device-archive';
import { WarnMessage } from '../warn-message/warn.message';
@Component({
  selector: 'equipment-message',
  templateUrl: 'equipment.message.html',
})
export class EquipmentMessage {
  telemetry = [
    {
      title: '总发电量：',
      shuju: '8k',
      danwei: 'kwh',
    },
    {
      title: '机内温度',
      shuju: '31.8',
      danwei: '℃',
    },
    {
      title: '设备开/关时长：',
      shuju: '80/60',
      danwei: 'h',
    },
    {
      title: '设备功率：',
      shuju: '98',
      danwei: '%',
    },
    {
      title: '有功功率：',
      shuju: '15.55',
      danwei: 'kwh',
    },
  ];
  private trendChartOption: any;
  task = 'telemetry';
  deviceId: string;
  deviceInfo: any = {};
  ycPoints: any = [];
  yxPoints: any = [];
  statusPoints: any = [];
  alarmCount: any;
  showYaoCe: boolean = false;
  showYaoXin: boolean = false;
  showActivity: boolean = false;
  constructor(
    public echartsService: EchartsService,
    public monitorService: MonitorService,
    public navPrarams: NavParams,
    public modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
    this.deviceId = this.navPrarams.get('deviceId');
    // this.deviceId = '000200000211'
  }

  ionViewWillEnter() {
    this.getEquipmentInfo();

    this.getDeviceAlarmCount();
  }

  getEquipmentInfo() {
    this.monitorService.getEquipmentInfo(this.deviceId).subscribe((e) => {
      if (e) {
        this.deviceInfo = e;
        //    this.trendChartOption = this.echartsService.initEc3(this.deviceInfo.charts);
        if (this.deviceInfo.ycPoints) {
          this.ycPoints = this.deviceInfo.ycPoints.show;
        }
        if (this.deviceInfo.yxPoints) {
          this.yxPoints = this.deviceInfo.yxPoints.show;
        }
        if (this.deviceInfo.statusPoints) {
          this.statusPoints = this.deviceInfo.statusPoints.show;
        }
      }
    });
  }

  showYaoCeClick() {
    this.showYaoCe = !this.showYaoCe;
    if (
      this.showYaoCe &&
      this.deviceInfo.ycPoints.hide &&
      this.deviceInfo.ycPoints.hide.length > 0
    ) {
      // this.ycPoints = this.ycPoints.push.apply(this.ycPoints, this.deviceInfo.ycPoints.hide);
      this.ycPoints = this.ycPoints.concat(this.deviceInfo.ycPoints.hide);
    } else {
      this.ycPoints = this.deviceInfo.ycPoints.show;
    }
  }

  showYaoXinClick() {
    this.showYaoXin = !this.showYaoXin;
    if (
      this.showYaoXin &&
      this.deviceInfo.yxPoints.hide &&
      this.deviceInfo.yxPoints.hide.length > 0
    ) {
      this.yxPoints = this.yxPoints.push.apply(
        this.yxPoints,
        this.deviceInfo.yxPoints.hide
      );
      // this.yxPoints = this.yxPoints.concat(this.deviceInfo.yxPoints.hide)
    } else {
      this.yxPoints = this.deviceInfo.yxPoints.show;
    }
  }

  showActivityClick() {
    this.showActivity = !this.showActivity;
    if (
      this.showActivity &&
      this.deviceInfo.statusPoints.hide &&
      this.deviceInfo.statusPoints.hide.length > 0
    ) {
      this.statusPoints = this.statusPoints.push.apply(
        this.statusPoints,
        this.deviceInfo.statusPoints.hide
      );
    } else {
      this.statusPoints = this.deviceInfo.statusPoints.show;
    }
  }

  getDeviceAlarmCount() {
    this.monitorService.getDeviceAlarmCount(this.deviceId).subscribe((e) => {
      this.alarmCount = e;
    });
  }

  deviceAlarmClick() {
    // let modal = this.modalCtrl.create(WarnMessage, { objType: '02', objIds: this.deviceId });
    // modal.onDidDismiss(e => { })

    // modal.present();

    this.navCtrl.push(WarnMessage, {
      equipment: {
        deviceId: this.deviceId,
        deviceName: this.deviceInfo.deviceName,
      },
      queryYears: true,
    });
  }

  deviceArchivePageClick() {
    this.navCtrl.push(DeviceArchivePage, {
      deviceId: this.deviceId,
    });
  }
}
