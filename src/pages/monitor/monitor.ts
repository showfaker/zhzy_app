import { Component, Inject, ViewChild } from '@angular/core';
import echarts from 'echarts';
import {
  Events,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
} from 'ionic-angular';
import { AppConfig, APP_CONFIG } from '../../models/app-config';
import { alarmlogsService } from '../../providers/alarmlogs.service';
import { EchartsService } from '../../providers/echarts.service';
import { MonitorService } from '../../providers/monitor.service';
import { WarnMessage } from '../home/warn-message/warn.message';
import { CommonStationPage } from './../util/common-station/common-station';
import { CameraListPage } from './camera-list/camera-list';
import { EquipmentListPage } from './equipment/equipmentList';
import { PowStaRecords } from './power-station-records/pow.sta.records';
import { SettingPage } from './child/setting';

@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {
  @ViewChild('echart') echart;
  public trendChartOption: any;
  public trendChartOption1: any;
  public trendChartOption2: any;
  // axisData3 = {
  //     xAxisData:[],
  //     yAxisData: []
  // }
  rankechart = 'fadian';
  summary;
  energies;
  inverterrank;
  alarmCount;
  energiesActive = 'hour'; //timeType：hour、day、month、year，默认hour
  inverterrankParam = {
    cateId: 'AI-NB-ZXYGDXS-M',
    sort: 'desc',
  };
  stationId: any = null;
  hadBackButton; //是否有上级页面
  constructor(
    public navCtrl: NavController,
    public echartsService: EchartsService,
    public monitorService: MonitorService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public alarmlogsService: alarmlogsService,
    private navParams: NavParams,
    private event: Events,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.hadBackButton = this.navParams.get('hadBackButton');
  }

  /**获取页面上半部分信息 */
  getsummary(stationId?: string) {
    this.monitorService.getsummary(stationId).subscribe((e) => {
      if (e) {
        this.summary = e;
        const ratio = this.summary.summaries[0] && this.summary.summaries[0].ratio;
        this.trendChartOption = {
          graphic: {
            elements: [
              {
                type: 'image',
                style: {
                  image:
                    `assets/imgs/monitor/chart-bg.png`,
                  width: 119,
                  height: 119,
                },
                left: 'center',
                top: 'middle',
                z: 0
              }
            ]
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            bottom: 30,
            left: '6%',
            itemWidth: 10,
            itemHeight: 10,
            borderRadius: 0,
            itemGap: 10,
            textStyle: {
              color: '#fff',
            },
          },
          series: [
            {
              type: 'pie',
              center: ['50%', '50%'],
              clockWise: false,
              hoverAnimation: false,
              radius: ['76%', '92%'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: '#4c4a4a',
                  formatter: `{title|${this.summary.summaries[0] && this.summary.summaries[0].title || ''}}\n{value|${this.summary.summaries[0] && this.summary.summaries[0].value || ''}}\n{unit|${this.summary.summaries[0] && this.summary.summaries[0].unit || ''}}`,
                  rich: {
                    title: {
                      fontSize: 12,
                      fontFamily: 'YouSheBiaoTiHei',
                      color: '#c3e7ff',
                    },
                    value: {
                      fontFamily: 'MiSans-Medium',
                      fontSize: 22,
                      color: '#3fff59',
                      fontWeight: 500,
                      lineHeight: 40
                    },
                    unit: {
                      fontFamily: 'MiSans-Medium',
                      fontSize: 12,
                      color: '#c2d2dd'
                    }
                  },
                },
              },
              color: ['#3BE23A', 'rgba(170,234,255,0.40)'],
              data: [{
                value: ratio,
                label: {
                  normal: {
                    show: false,
                  },
                },
              }, {
                value: 100 - ratio,
              }],
            },
          ],
        }

        this.getalarmCount(this.summary.stationId);
        this.getinverterrankUrl(
          this.summary.stationId,
          this.inverterrankParam.cateId,
          this.inverterrankParam.sort
        );
      }
    });
  }
  /**获取发电曲线数据 */
  getenergies(stationId?: string) {
    this.monitorService
      .getenergies(this.energiesActive, stationId)
      .subscribe((e) => {
        if (e) {
          this.energies = e;
          this.trendChartOption1 = (this.echartsService.initEc3(
            e,
            this.appConfig.theme
          ) as any);
        }
      });
  }
  /**获取电站告警数量 */
  getalarmCount(stationId: string) {
    this.alarmlogsService.getAlarmCount(stationId).subscribe((e) => {
      this.alarmCount = e;
    });
  }
  /**获取逆变器发电排行 */
  getinverterrankUrl(stationId: string, cateId: string, sort: string) {
    this.monitorService
      .getinverterrankUrl(stationId, cateId, sort)
      .subscribe((e) => {
        if (e) {
          this.inverterrank = e;
          this.trendChartOption2 = this.echartsService.initEc4(
            this.buildTrendChartOption(e['content']),
            this.appConfig.theme,
            sort
          );
          console.log(this.trendChartOption2);

        }
      });
  }

  ionViewDidLoad() {
    this.stationId = localStorage.getItem('stationId');
    this.getsummary(this.stationId);
    this.getenergies(this.stationId);
  }
  
  // enter page to update stationId request
  ionViewWillEnter() {
    let GlobalSearch = localStorage.getItem('isFromGlobalSearch');
    if (GlobalSearch) {
      this.stationId = localStorage.getItem('stationId');
      this.getsummary(this.stationId);
      this.getenergies(this.stationId);
    }
  }

  ionViewWillLeave() {
    localStorage.removeItem('stationId');
    localStorage.removeItem('isFromGlobalSearch');
  }

  buildTrendChartOption(content) {
    let axisData = {
      xAxisData: [],
      yAxisData: [],
    };
    for (let obj of content) {
      if (!obj.value) {
        obj.value = "0h"
      }
      if (!obj.unit) {
        obj.unit = "h"
      }
      // 逆变器名称
      let description = obj.deviceName + obj.deviceNo;
      axisData.xAxisData.push(description + ' ' + obj.value + obj.unit);
      axisData.yAxisData.push(obj.ratio);
    }
    return axisData;
  }

  /**发电曲线时间选择 */
  selectenergiesActive(type) {
    this.energiesActive = type;
    this.getenergies(this.summary.stationId);
  }

  /**打开排行设置 */
  openSetting() {
    let modal = this.modalCtrl.create(
      SettingPage,
      { inverterrankParam: this.inverterrankParam },
      {
        cssClass: 'commonModal commonInputModal settingModel',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((e) => {
      if (e) {
        this.inverterrankParam = e;
        this.getinverterrankUrl(
          this.summary.stationId,
          this.inverterrankParam.cateId,
          this.inverterrankParam.sort
        );
      }
    });
    modal.present();
  }

  //电站列表
  toPowerStation() {
    let modal = this.modalCtrl.create(CommonStationPage, {});
    modal.onDidDismiss((e) => {
      if (e) {
        this.getsummary(e.id);
        this.getenergies(e.id);
      }
    });
    modal.present({ keyboardClose: true });
  }

  //设备列表
  toEquipmentList() {
    // let modal = this.modalCtrl.create(EquipmentListPage, {
    //     stationId: this.summary.stationId
    // });
    // modal.onDidDismiss((e) => {});
    // modal.present({ keyboardClose: true });
    this.navCtrl.push(EquipmentListPage, { stationId: this.summary.stationId });
  }

  /**告警页面 */
  towarnMessage() {
    this.navCtrl.push(WarnMessage, {
      station: { id: this.summary.stationId, title: this.summary.stationName },
      queryYears: true,
    });
  }

  powStaRecords() {
    let modal = this.modalCtrl.create(PowStaRecords, {});
    modal.onDidDismiss((e) => { });
    modal.present({ keyboardClose: true });
    // this.navCtrl.push(PowStaRecords)
  }

  camera() {
    // let modal = this.modalCtrl.create(CameraListPage, {
    //     stationId: this.summary.stationId
    // });
    // modal.onDidDismiss((e) => {});
    // modal.present({ keyboardClose: true });
    this.navCtrl.push(CameraListPage, { stationId: this.summary.stationId });
  }

  /**返回首页 */
  goBack() {
    if (this.hadBackButton) {
      this.navCtrl.pop();
    } else {
      this.event.publish('changerTab', { index: 0 });
    }
  }
}
