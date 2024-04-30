import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  NavController,
  ModalController,
  Events,
  NavParams,
  ViewController,
  MenuController,
  ActionSheetController,
} from 'ionic-angular';
import { ModulesService } from '../../../../providers/modules.service';
import { MutilService } from '../../../../providers/util/Mutil.service';
import { MonitorPage } from '../../../monitor/monitor';
import { WarnMessage } from '../../warn-message/warn.message';
import { DeviceDetailsPage } from './device-details/device-details';
import * as moment from 'moment';
import echarts from 'echarts';

@Component({
  selector: 'page-modules-details1',
  templateUrl: 'modules-details1.html',
})
export class ModulesDetails1Page {
  @ViewChild('echart') echart;
  searchChartOption: any;
  param; //参数
  modulesDetails;
  toDate = this.mUtil.buildTime('yyyy-MM-dd', new Date().getTime());
  hasCharts: any;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public event: Events,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modulesService: ModulesService,
    public menuController: MenuController,
    public mUtil: MutilService,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.param = this.navParams.get('param');
  }

  ionViewDidLoad() {
    this.initDetails(this.param);
  }

  /**
   * 初始化详情页面
   * @param param 参数 感觉不同模块获取不同参数
   */
  initDetails(param: string) {
    let that = this;
    this.modulesService.modulesDetailsInit(param).subscribe((e) => {
      console.log('新首页模块详情初始化：11', e);
      if (e) {
        that.modulesDetails = e;
        if (e.dateType == '1' || e.dateType == '2') {
          that.startDate = moment(e.startDate).format();
        }
        if (e.dateType == '2') {
          that.endDate = moment(e.endDate).format();
        }
        that.getModulesList();
        this.hasCharts = this.modulesDetails.hasCharts;
        if (this.hasCharts) {
          this.loadChart();
        }
      }
    });
  }

  modulesList = [];
  /**
   * 获取列表信息
   * @param param
   */
  getModulesList(refresher?) {
    this.modulesService
      .modulesList(this.param, this.buildData())
      .subscribe((e) => {
        console.log('数据列表:', this.param, ' ', e);
        if (e && e['content'] && e['content'].length > 0) {
          this.modulesList = this.modulesList.concat(e['content']);
          // this.modulesList = e.content;
        }
        if (this.modulesList.length >= e.totalElements) {
          this.canInfinite = false;
        } else {
          this.canInfinite = true;
        }
        if (refresher) {
          refresher.complete();
          console.log('加载完成后，关闭刷新');
        }
      });
  }

  public loadChart() {
    const params: any = this.buildData();
    delete params.page;
    delete params.size;
    this.modulesService.getModuleChart(this.param, params).subscribe((res) => {
      this.searchChartOption = res;
    });
  }

  buildData() {
    // 入参	startDate：日期，必填，默认今天，格式yyyy-MM-dd
    // stationName：电站，非必填
    // provinceId：省ID，非必填
    // cityId：市ID，非必填
    // countyId：县ID，非必填
    // stationType：电站类型ID，非必填
    // sort：排序字段code，必填
    // direction：排序方向，asc或desc，必填
    // page：当前页（从0开始），默认0
    // size：每页记录数，默认10

    let data = {};
    if (
      this.modulesDetails.dateType == '1' ||
      this.modulesDetails.dateType == '2'
    ) {
      data['startDate'] = moment(this.modulesDetails.startDate).format(
        'YYYY-MM-DD'
      );
    }
    if (this.modulesDetails.dateType == '2') {
      data['endDate'] = moment(this.modulesDetails.endDate).format(
        'YYYY-MM-DD'
      );
    }
    data['provinceId'] =
      (this.modulesDetails.province && this.modulesDetails.province.first) ||
      '';
    data['cityId'] =
      (this.modulesDetails.city && this.modulesDetails.city.first) || '';
    data['countyId'] =
      (this.modulesDetails.county && this.modulesDetails.county.first) || '';
    data['stationType'] =
      (this.modulesDetails.station && this.modulesDetails.station.first) || '';

    data['sort'] = this.modulesDetails.defaultSort.first;
    data['direction'] = this.modulesDetails.direction || 'asc';
    data['stationName'] = this.modulesDetails.stationName;
    data['page'] = this.page || 0;
    data['size'] = 10;

    return data;
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  backupsModulesDetails; //打开侧边栏时备份筛选条件
  /**搜索菜单打开时 */
  menuInit() {
    this.backupsModulesDetails = JSON.parse(
      JSON.stringify(this.modulesDetails)
    );
  }

  /**搜索菜单关闭时 */
  ionClose() { }

  /**控制侧边栏 */
  serchMenu() {
    this.menuController.enable(true, 'search');
    this.menuController.open('search');
  }

  /**拼接图片路径 */
  getImg(imgName) {
    return `assets/imgs/list/${imgName}`;
  }

  /**
   * 生成选项列表
   * @param datas 列表
   * @param name1 列表显示内容的key
   * @param name2 点击需要的key值 若为空则取整个对象
   * @param key 保存在modulesDetails中的key值
   * @param isQ 是否查询初始化查询列表
   */
  buildActionSheet(datas, name1, name2, key, isQ) {
    let that = this;
    let buttons = [];
    for (const data of datas) {
      buttons.push({
        text: data[name1],
        handler: () => {
          if (name2) {
            that.modulesDetails[key] = data[name2];
          } else {
            that.modulesDetails[key] = data;
          }
          if (isQ) {
            that.submit();
          }
        },
      });
    }
    buttons.push({
      text: '取消',
      role: 'cancel',
      handler: () => {
        console.log('取消 clicked');
      },
    });
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'modules-details1-sheetctrl',
      buttons: buttons,
    });
    actionSheet.present();
    console.log('Clicked to update picture');
  }

  /**选择 */
  select(key) {
    switch (key) {
      case 'defaultSort':
        this.buildActionSheet(
          this.modulesDetails.sorts,
          'second',
          '',
          key,
          true
        );
        break;
      case 'desc':
        this.modulesDetails.direction = key;
        this.submit();
        break;
      case 'asc':
        this.modulesDetails.direction = key;
        this.submit();
        break;
      case 'province':
        this.getRegions('CN', key);
        this.modulesDetails.city = null;
        this.modulesDetails.county = null;
        break;
      case 'city':
        if (
          this.modulesDetails.province &&
          this.modulesDetails.province.first
        ) {
          this.getRegions(this.modulesDetails.province.first, key);
          this.modulesDetails.county = null;
        }
        break;
      case 'county':
        if (this.modulesDetails.city && this.modulesDetails.city.first) {
          this.getRegions(this.modulesDetails.city.first, key);
        }
        break;
      case 'station':
        this.getStationType(key);
        break;
    }
  }

  /**
   * 查询省，市，县列表
   */
  getRegions(parentId: string, key) {
    this.modulesService.regions(parentId).subscribe((e) => {
      console.log(e);
      if (e && e.length > 0) {
        this.buildActionSheet(e, 'second', '', key, false);
      } else {
        this.mUtil.popToastView('暂无相关数据!');
      }
    });
  }

  /**获取电站类型列表 */
  getStationType(key: string) {
    this.modulesService.stationType().subscribe((e) => {
      console.log(e);
      if (e && e.length > 0) {
        this.buildActionSheet(e, 'second', '', key, false);
      }
    });
  }

  startDate: string;
  endDate: string;
  /**时间选择 */
  changeDate(type) {
    this.modulesDetails[type] = this[type];
  }

  /**重置 */
  reset() {
    this.modulesDetails = JSON.parse(
      JSON.stringify(this.backupsModulesDetails)
    );
    this.startDate = this.mUtil.buildTime(
      'yyyy-MM-dd',
      this.modulesDetails.startDate
    );
    this.endDate = this.mUtil.buildTime(
      'yyyy-MM-dd',
      this.modulesDetails.endDate
    );
    /* delete history data */
    if (this.modulesDetails.station) {
      delete this.modulesDetails.station;
    }
  }

  /**查询 */
  submit() {
    this.menuController.close('search');
    this.page = 0;
    this.modulesList = [];
    this.getModulesList();
    if (this.hasCharts) {
      this.loadChart();
    }
  }

  page = 0;
  canInfinite = false;
  /**
   * 下拉刷新
   *
   */
  doRefresh(refresher) {
    console.log('下拉刷新');
    this.page = 0;
    this.modulesList = [];
    this.getModulesList(refresher);
    if (this.hasCharts) {
      this.loadChart();
    }
  }

  /**
   * 上拉加载
   * @param infiniteScroll
   */
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    this.page++;
    this.getModulesList(infiniteScroll);
  }

  /**
   * 接入设备页面
   */
  toDevicePage(modules) {
    console.log(modules);
    if (modules && modules.url) {
      switch (modules.url) {
        case 'APP_STATION_MONITOR':
          //跳转到对应电站的电站监视页面
          localStorage.setItem('stationId', modules.id);
          this.navCtrl.push(MonitorPage, { hadBackButton: true });
          break;
        case 'APP_ALARM':
          //跳转到告警记录页面
          this.navCtrl.push(WarnMessage, {
            station: { id: modules.id, title: modules.title },
          });

          break;
        default:
          //跳转到设备监视列表页面
          let index = modules.url.indexOf('APP_MT_DEVICE_LIST');
          if (index == 0) {
            let datas: any[] = modules.url.split('?');
            if (datas && datas.length > 0) {
              let searchModal = this.modalCtrl.create(
                DeviceDetailsPage,
                {
                  param: {
                    data: datas[1],
                    stationId: modules.id,
                    deviceType: this.modulesDetails.defaultSort.first,
                  },
                },
                { showBackdrop: true }
              );

              searchModal.present();
            } else {
              this.mUtil.customAlert({ msg: '缺少必要参数' });
            }
          }
      }
    }
  }

  // // 电站选择
  // selectStation() {
  //     let modal = this.modalCtrl.create(CommonStationPage, {});
  //     modal.onDidDismiss((e) => {
  //         if (e) {
  //             this.modulesDetails['stationName'] = e.title
  //             // this.station = e;
  //         }
  //     });
  //     modal.present({ keyboardClose: true });
  // }

  public getValueHighLight(item) {
    if (this.param === 'stationAlarm') {
      let trimString = item.replace(/\s*/g, "");
      return trimString.split(':')
    }
    return item
  }

}
