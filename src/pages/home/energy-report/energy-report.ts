import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Component } from '@angular/core';
import {
  ActionSheetController,
  MenuController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import moment from 'moment';
import { ModulesService } from '../../../providers/modules.service';
import { MutilService } from '../../../providers/util/Mutil.service';
import * as _ from 'lodash';
/**
 * Generated class for the EnergyReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-energy-report',
  templateUrl: 'energy-report.html',
})
export class EnergyReportPage {
  title: string;
  modulesDetails: any = {};

  param: any;
  stationTypeOptions: any;
  startDate;
  endDate;
  initData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modulesservice: ModulesService,
    private menuController: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private mUtil: MutilService,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {}

  /**拼接图片路径 */
  getImg(imgName) {
    return 'ios-' + imgName.split('.')[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnergyReportPage');
    this.initPage();
  }

  initPage() {
    this.modulesservice.reportEnergyInit().subscribe((res) => {
      if (!_.isEmpty(res)) {
        this.title = res.title;
        this.initData = { ...res };
        this.modulesDetails = {
          ...res,
          dataType: 'all',
          timeType: 'day',
          stationName: null,
          provinceId: null,
          cityId: null,
          countyId: null,
          stationType: null,
        };

        this.startDate = this.formatData(
          this.modulesDetails.defaultDates['day'][0]
        );
        this.endDate = this.formatData(
          this.modulesDetails.defaultDates['day'][1]
        );

        this.getModulesList();
      }
    });
    this.modulesservice.stationType().subscribe((res) => {
      if (res && res.length > 0) {
        this.stationTypeOptions = res;
      }
    });
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  /**控制侧边栏 */
  serchMenu() {
    this.menuController.enable(true, 'search');
    this.menuController.open('search');
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

  modulesList = [];
  /**
   * 获取列表信息
   * @param param
   */
  getModulesList(refresher?) {
    this.modulesservice.reportEnergyList(this.buildData()).subscribe((e) => {
      console.log('数据列表:', ' ', e);
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
        this.buildActionSheet(
          this.stationTypeOptions,
          'second',
          '',
          key,
          false
        );
        break;
    }
  }

  /**
   * 查询省，市，县列表
   */
  getRegions(parentId: string, key) {
    this.modulesservice.regions(parentId).subscribe((e) => {
      console.log(e);
      if (e && e.length > 0) {
        this.buildActionSheet(e, 'second', '', key, false);
      } else {
        this.mUtil.popToastView('暂无相关数据!');
      }
    });
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

  buildData() {
    let data = {};

    data['dataType'] = this.modulesDetails.dataType || 'all';

    data['timeType'] = this.modulesDetails.timeType || 'day';

    switch (data['timeType']) {
      case 'day':
        data['startDate'] = moment(this.modulesDetails['startDate']).format(
          'YYYY-MM-DD'
        );
        data['endDate'] = moment(this.modulesDetails['endDate']).format(
          'YYYY-MM-DD'
        );
        break;
      case 'month':
        data['startDate'] = moment(this.modulesDetails['startDate']).format(
          'YYYY-MM'
        );
        data['endDate'] = moment(this.modulesDetails['endDate']).format(
          'YYYY-MM'
        );
        break;
      case 'quarter':
        data['startDate'] = moment(this.modulesDetails['startDate']).format(
          'YYYY-MM'
        );
        data['endDate'] = moment(this.modulesDetails['endDate']).format(
          'YYYY-MM'
        );
        break;
      case 'year':
        data['startDate'] = moment(this.modulesDetails['startDate']).format(
          'YYYY'
        );
        data['endDate'] = moment(this.modulesDetails['endDate']).format('YYYY');
        break;
      default:
        break;
    }
    data['stationName'] = this.modulesDetails['stationName'];
    data['provinceId'] =
      (this.modulesDetails.province && this.modulesDetails.province.first) ||
      null;
    data['cityId'] =
      (this.modulesDetails.city && this.modulesDetails.city.first) || null;
    data['countyId'] =
      (this.modulesDetails.county && this.modulesDetails.county.first) || null;
    data['stationType'] =
      (this.modulesDetails.station && this.modulesDetails.station.first) ||
      null;

    if (data['dataType'] !== 'all') {
      data['energyFloor'] = !isNaN(this.modulesDetails['energyFloor'])
        ? this.modulesDetails['energyFloor']
        : null;
      data['energyCeil'] = !isNaN(this.modulesDetails['energyCeil'])
        ? this.modulesDetails['energyCeil']
        : null;
      if (data['energyFloor'] > data['energyCeil']) {
        data['energyCeil'] = null;
      }

      data['kwhkwpFloor'] = !isNaN(this.modulesDetails['kwhkwpFloor'])
        ? this.modulesDetails['kwhkwpFloor']
        : null;
      data['kwhkwpCeil'] = !isNaN(this.modulesDetails['kwhkwpCeil'])
        ? this.modulesDetails['kwhkwpCeil']
        : null;
      if (data['kwhkwpFloor'] > data['kwhkwpCeil']) {
        data['kwhkwpCeil'] = null;
      }
      data['rateFloor'] = !isNaN(this.modulesDetails['rateFloor'])
        ? this.modulesDetails['rateFloor']
        : null;
      data['rateCeil'] = !isNaN(this.modulesDetails['rateCeil'])
        ? this.modulesDetails['rateCeil']
        : null;
      if (data['rateFloor'] > data['rateCeil']) {
        data['rateCeil'] = null;
      }
    }

    data['sort'] = this.modulesDetails.defaultSort.first;
    data['direction'] = this.modulesDetails.direction || 'asc';
    data['stationName'] = this.modulesDetails.stationName;
    data['page'] = this.page || 0;
    data['size'] = 10;

    return data;
  }

  /**查询 */
  submit() {
    if (
      moment(this.modulesDetails['startDate']).valueOf() >
      moment(this.modulesDetails['endDate']).valueOf()
    ) {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '所选时间范围不正确',
        buttons: ['确定'],
      });
      alert.present();
      return;
    }
    this.menuController.close('search');
    this.page = 0;
    this.modulesList = [];
    this.getModulesList();
  }

  backupsModulesDetails; //打开侧边栏时备份筛选条件
  /**搜索菜单打开时 */
  menuInit() {
    // this.backupsModulesDetails = JSON.parse(JSON.stringify(this.modulesDetails));
  }

  /**搜索菜单关闭时 */
  ionClose() {}

  /**重置 */
  reset() {
    this.modulesDetails = {
      ...this.initData,
      dataType: 'all',
      timeType: 'day',
      stationName: null,
      provinceId: null,
      cityId: null,
      countyId: null,
      stationType: null,
    };

    this.startDate = this.formatData(
      this.modulesDetails.defaultDates['day'][0]
    );
    this.endDate = this.formatData(this.modulesDetails.defaultDates['day'][1]);
  }

  changeDate(event, date) {
    this.modulesDetails[date] = this[date];
  }

  setTimeType(type) {
    this.modulesDetails.timeType = type;
    switch (this.modulesDetails.timeType) {
      case 'day':
        this.startDate = this.formatData(
          this.modulesDetails.defaultDates['day'][0]
        );
        this.endDate = this.formatData(
          this.modulesDetails.defaultDates['day'][1]
        );
        break;
      case 'month':
        this.startDate = this.formatData(
          this.modulesDetails.defaultDates['month'][0]
        );
        this.endDate = this.formatData(
          this.modulesDetails.defaultDates['month'][1]
        );
        break;
      case 'quarter':
        this.startDate = this.formatData(
          this.modulesDetails.defaultDates['quarter'][0]
        );
        this.endDate = this.formatData(
          this.modulesDetails.defaultDates['quarter'][1]
        );
        break;
      case 'year':
        this.startDate = this.formatData(
          this.modulesDetails.defaultDates['year'][0]
        );
        this.endDate = this.formatData(
          this.modulesDetails.defaultDates['year'][1]
        );
        break;
      default:
        this.startDate = this.formatData(
          this.modulesDetails.defaultDates['day'][0]
        );
        this.endDate = this.formatData(
          this.modulesDetails.defaultDates['day'][1]
        );
        break;
    }
  }

  showFormat() {
    switch (this.modulesDetails.timeType) {
      case 'day':
        return 'YYYY-MM-DD';
      case 'month':
        return 'YYYY-MM';
      case 'quarter':
        return 'YYYY-MM';
      case 'year':
        return 'YYYY';
      default:
        return 'YYYY-MM-DD';
    }
  }

  formatData(data = null) {
    let dateFormString = '';
    switch (this.modulesDetails.timeType) {
      case 'day':
        dateFormString = 'YYYY-MM-DD';
        break;
      case 'month':
        dateFormString = 'YYYY-MM';
        break;
      case 'quarter':
        dateFormString = 'YYYY-MM';
        break;
      case 'year':
        dateFormString = 'YYYY';
        break;
      default:
        dateFormString = 'YYYY-MM-DD';
        break;
    }
    if (data) {
      return moment(data).format(dateFormString);
    }
    return null;
  }
}
