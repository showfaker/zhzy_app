import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  NavController,
  ModalController,
  Events,
  NavParams,
  ViewController,
  MenuController,
  ActionSheetController,
} from 'ionic-angular';
import echarts from 'echarts';
import { ModulesService } from '../../../../providers/modules.service';
import { MutilService } from '../../../../providers/util/Mutil.service';
import { EchartsService } from '../../../../providers/echarts.service';
import { CommonStationPage } from '../../../util/common-station/common-station';
import * as moment from 'moment';
// declare var echarts;
@Component({
  selector: 'page-modules-details4',
  templateUrl: 'modules-details4.html',
})
/**
 * 损失电量统计详情
 */
export class ModulesDetails4Page {
  modules; //参数
  modulesDetails;
  toDate = moment(new Date().getTime()).format('YYYY-MM-DD');
  echartsDatas = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public event: Events,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modulesService: ModulesService,
    public menuController: MenuController,
    public mUtil: MutilService,
    public actionSheetCtrl: ActionSheetController,
    public echartsService: EchartsService
  ) {
    this.modules = this.navParams.get('param');
    this.modulesDetails = {};
    this.modulesDetails['title'] = this.navParams.get('title');
    if (this.modules) {
      this.modulesDetails = this.modules;
    }
  }

  ionViewDidLoad() {
    this.initDetails();
  }

  /**
   * 初始化详情页面
   */
  initDetails() {
    let d = new Date();
    if (this.modulesDetails.startDate && this.modulesDetails.endDate) {
      this.startDate = moment(this.modulesDetails.startDate).format('YYYY-MM-DD');
      this.endDate = moment(this.modulesDetails.endDate).format('YYYY-MM-DD');
    } else {
      this.startDate = moment().startOf('month').format('YYYY-MM-DD');
      this.endDate = moment().endOf('month').format('YYYY-MM-DD');
      this.modulesDetails.startDate = this.startDate;
      this.modulesDetails.endDate = this.endDate;
    }
    this.getModulesList();
  }

  modulesList = [];
  /**
   * 获取列表信息
   * @param param
   */
  getModulesList(refresher?) {
    this.modulesService.lossDetail(this.buildData()).subscribe((e) => {
      if (e && e['content'] && e['content'].length > 0) {
        this.modulesList = this.modulesList.concat(e['content']);
        // this.modulesList = e.content;
      }
      if (e.totalElements == 0) {
        this.mUtil.popToastView('无数据');
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

  /**列表请求参数 */
  buildData(type?) {
    let data = { stationIds: '' };

    data['startDate'] = moment(this.modulesDetails.startDate).format('YYYY-MM-DD');
    data['endDate'] = moment(this.modulesDetails.endDate).format('YYYY-MM-DD');

    if (this.modulesDetails.stationList) {
      for (const station of this.modulesDetails.stationList) {
        data['stationIds'] = data['stationIds'] + station.id + ',';
      }
    }
    // data['stationIds'] = this.modulesDetails.stationIds;
    if (type != 'Echart') {
      data['page'] = this.page || 0;
      data['size'] = 10;
    }

    return data;
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  backupsModulesDetails; //打开侧边栏时备份筛选条件
  /**搜索菜单打开时 */
  menuInit() {
    this.backupsModulesDetails = JSON.parse(JSON.stringify(this.modulesDetails));
  }

  /**搜索菜单关闭时 */
  ionClose() {
    this.reset();
  }

  /**控制侧边栏 */
  serchMenu() {
    this.menuController.enable(true, 'search4');
    this.menuController.open('search4');
  }

  /**拼接图片路径 */
  getImg(imgName) {
    return 'assets/imgs/list/' + imgName;
  }

  /**电站选择 */
  selectStation() {
    let that = this;
    console.log('当前所选电站列表：', that.modulesDetails.stationList);
    let modal = this.modalCtrl.create(CommonStationPage, {
      isMultiSelect: true,
      stationList: that.modulesDetails.stationList,
    });
    modal.onDidDismiss((e) => {
      if (e) {
        that.modulesDetails.stationList = e;
        console.log('选择的电站列表：', e);
      }
    });
    modal.present({ keyboardClose: true });
  }

  getStationNum() {
    let num = this.modulesDetails.stationList && this.modulesDetails.stationList.length;
    if (num) {
      return '已选择 ' + num + ' 个电站';
    } else {
      return '请选择';
    }
  }

  startDate: string;
  endDate: string;
  /**时间选择 */
  changeDate(type) {
    this.modulesDetails[type] = this[type];
  }

  /**重置 */
  reset() {
    this.modulesDetails = JSON.parse(JSON.stringify(this.backupsModulesDetails));
    this.startDate = moment(this.modulesDetails.startDate).format('YYYY-MM-DD');
    this.endDate = moment(this.modulesDetails.endDate).format('YYYY-MM-DD');
  }

  /**查询 */
  submit() {
    this.backupsModulesDetails = JSON.parse(JSON.stringify(this.modulesDetails));
    this.menuController.close('search4');
    this.page = 0;
    this.modulesList = [];
    this.getModulesList();
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

  /**导出文件 */
  downLoadFile() {
    this.mUtil.customPrompt({ msg: '确定下载该文件吗?' }, () => {
      this.modulesService.exportStationLossTypesDetails(
        this.buildData('Echart'),
        `损失电量明细.xlsx`
      );
    });
  }
}
