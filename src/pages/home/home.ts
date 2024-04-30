import { DefectManagementPage } from './../operations/defect-management/defect-management';
import { QrSearchService } from './../../providers/qr-search.service';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  NavController,
  ModalController,
  Events,
  NavParams,
} from 'ionic-angular';
import echarts from 'echarts';
import { ScanMessage } from './scan-message/scan.message';
import { EchartsService } from '../../providers/echarts.service';
import { GlobalSearch } from '../util/global-search/global.search';
import { LogList } from './log-list/log.list';
import { HomeService } from '../../providers/home.service';
import { DailyReport } from './daily-report/daily-report';
import { ToolPageV1 } from '../operations/tool-v1/tool';
import { CargoManage } from '../operations/cargo-manage/cargo-manage';
import { NoticeList } from '../operations/notice-list/notice.list';
import { OperateTask } from '../operations/operate-task/operate-task';
import { BarcodeScannerPage } from '../barcode-scanner/barcode-scanner';
import { QrResultBarPage } from '../qr-result-bar/qr-result-bar';
import { JobRecordPage } from '../operations/job-record/job-record';
import { InventorisPage } from '../operations/inventoris/inventoris';
import { ModulesNewPage } from './modules-details/modules-new';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('echart') echart;
  public trendChartOption: any;
  public trendChartOption1: any;
  task = 'mytask';
  homeInfo;
  homePageModules;
  homePage;
  device: any;
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public echartsService: EchartsService,
    public modalCtrl: ModalController,
    public homeService: HomeService,
    public event: Events,
    private qrsearchservice: QrSearchService,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.homePage = navParams.get('homepage');
  }

  gethomeinfo() {
    const params = this.homePage === 'DEFAULT' ? true : false;
    this.homeService.gethomeinfo(params).subscribe((e) => {
      this.homeInfo = e;
      this.trendChartOption = this.echartsService.initEc1(
        e['chartOption'],
        this.appConfig.theme
      );
      // this.trendChartOption1 = this.echartsService.initEc5(
      //   e['subInfos'],
      //   this.appConfig.theme
      // );



    });
  }


  getPie(data, index) {
    return {
      graphic: {
        name: data.title,
        elements: [
          {
            type: 'image',
            style: {
              image:
                `assets/imgs/home/topbg/icon-${index + 1}.png`,
              width: 30,
              height: 30,
            },
            left: 'center',
            top: 'middle',
            z: 0
          }
        ]
      },
      series: [
        {
          type: 'pie',
          name: 'center',
          radius: ['60%', '75%'],
          center: ['50%', '50%'],
          color: ['rgba(255,255,255,1)', 'rgba(255,255,255,0.15)'],
          data: [{
            value: 0,
          }, {
            value: 100,
          }],
          label: {
            show: false,
          },
          hoverAnimation: false,
        },
        {
          type: 'pie',
          name: data.title,
          radius: ['85%', '100%'],
          center: ['50%', '50%'],
          color: ['rgba(255,255,255,1)', 'rgba(255,255,255,0.25)'],
          data: [{
            value: data.ratio,
          },
          {
            value: 100 - data.ratio,
          },],
          label: {
            show: false,
          },
          hoverAnimation: false,
        }
      ]
    }



  }

  getmodules() {
    this.homeService.modules().subscribe((e) => {
      if (e) {
        this.homePageModules = e['allModules'];
      }
      console.log(e);
    });
  }

  ionViewWillEnter() {
    this.gethomeinfo();
    this.getmodules();
    this.device = this.navParams.get('qrResult');
    if (this.device) {
      this.qrsearchservice.qrsearch(this.device).subscribe((res) => {
        if (res) {
          let qrSearchBarHeight = '';
          if (res.modules.length <= 4) {
            qrSearchBarHeight = 'qrSearchBar1';
          } else if (res.modules.length > 4 && res.modules.length <= 8) {
            qrSearchBarHeight = 'qrSearchBar2';
          } else if (res.modules.length > 8 && res.modules.length <= 12) {
            qrSearchBarHeight = 'qrSearchBar3';
          }
          const modal = this.modalCtrl.create(
            QrResultBarPage,
            { info: res },
            {
              cssClass: qrSearchBarHeight,
              showBackdrop: true,
              enableBackdropDismiss: true,
            }
          );
          modal.onDidDismiss((data) => {
            if (data) {
              this.navCtrl.push(data.page, data.params);
            } else {
              this.navParams.data.qrResult = null;
            }
          });
          modal.present();
        }
      });
    }
  }
  /**判断模块是否显示 */
  showModule(modelType) {
    if (this.homePageModules && this.homePageModules.length > 0) {
      for (let homePageModule of this.homePageModules) {
        if (homePageModule.id == modelType) {
          return homePageModule.show;
        }
      }
    }
  }
  /** */
  changerTab(index) {
    // this.event.publish('changerTab', { index: index });
    this.navCtrl.push(ModulesNewPage);
  }
  /**
   * 运行日志
   */
  logList() {
    this.navCtrl.push(LogList);
  }

  /**
   * 扫码信息
   */
  scan() {
    this.navCtrl.push(BarcodeScannerPage);
  }
  /**
   * 搜索页面
   */
  search() {
    // let searchModal = this.modalCtrl.create(GlobalSearch);
    // searchModal.present();
    this.navCtrl.push(GlobalSearch);
  }

  noticeList() {
    this.navCtrl.push(NoticeList);
  }
  toCargoManage() {
    this.navCtrl.push(CargoManage);
  }
  toTool(classType) {
    this.navCtrl.push(ToolPageV1, { classType: classType });
  }
  toDefectManage() {
    // this.navCtrl.push(DefectManage);
    this.navCtrl.push(DefectManagementPage);
  }
  toOperateTask() {
    this.navCtrl.push(OperateTask);
  }

  /***********************************************旧的 */
  /**
   * 电量日报
   */
  dailyReport() {
    this.navCtrl.push(DailyReport);
  }

  // 运行日报
  toJobRecord() {
    this.navCtrl.push(JobRecordPage);
  }

  // 备品备件
  toInventoris() {
    this.navCtrl.push(InventorisPage);
  }
}
