import { DefectManagementDetailsPage } from './../defect-management-details/defect-management-details';
import { DefesService } from './../../../providers/defes.servicer';
import { MutilService } from './../../../providers/util/Mutil.service';
import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  MenuController,
  AlertController,
} from 'ionic-angular';
import { MaterialService } from '../../../providers/material.service';
import * as moment from 'moment';
import { CommonStationPage } from '../../util/common-station/common-station';
import { CommonUserPage } from '../../util/common-user/common-user';
import * as _ from 'lodash';
import { BackendService } from '../../../providers/backend.service';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';
import { DebounceService } from '../../../providers/debounce.service';

/**
 * Generated class for the DefectManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 缺陷工单
 */

@Component({
  selector: 'page-defect-management',
  templateUrl: 'defect-management.html',
})
export class DefectManagementPage {
  page: any = 0;
  warehouseId: any;
  materialId: any;
  defectsList: any;
  canInfinite: boolean;
  searchPageParams: any = {
    startReportTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endReportTime: moment().format('YYYY-MM-DD'),
    defectStatus: [],
  };

  freshPage: any;

  // 快速查询选项
  aQueryFlag = [
    { first: '01', second: '我的待办' },
    { first: '02', second: '我负责的' },
    { first: '05', second: '我发现的' },
    { first: '03', second: '我参与的' },
    { first: '04', second: '抄送我的' },
  ];

  customStartPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchPageParams.startReportTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  customEndPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchPageParams.endReportTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  equipment: any;
  station: any;
  responsiblePerson: any;
  aDefectStatus: any;
  showMenu: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private materialservice: MaterialService,
    private modalCtrl: ModalController,
    private mutilservice: MutilService,
    private defesservice: DefesService,
    private menuController: MenuController,
    private backendservice: BackendService,
    private alertCtrl: AlertController,
    private debounceservice: DebounceService,
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefectManagementPage');
    this.searchPageParams.stationId = this.navParams.get('stationId');
    this.searchPageParams.stationName = this.navParams.get('stationName');
    if (this.searchPageParams.stationId && this.searchPageParams.stationName) {
      this.station = {
        id: this.searchPageParams.stationId,
        title: this.searchPageParams.stationName,
      };
    }
    this.searchPageParams.equipment = this.navParams.get('equipment');
    this.equipment = this.navParams.get('equipment');
    // 获取缺陷状态
    this.backendservice.getProps({ typeId: 'defectStatus' }).subscribe((res) => {
      this.aDefectStatus = res;
    });

    let d = this.navParams.get('startDate');
    if (d) {
      this.searchPageParams.startReportTime = moment(d).startOf('month').format('YYYY-MM-DD');
      this.searchPageParams.endReportTime = moment(d).endOf('month').format('YYYY-MM-DD');
    }
    this.searchPageParams.queryFlag = this.navParams.get('queryFlag');
    this.getDefectsList(true);
  }

  ionViewWillEnter() {
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.freshPage = false;
      this.getDefectsList(true);
    }
    const equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      this.navParams.data.equipmentList = [];
      if (equipmentList.length > 0) {
        this.equipment = equipmentList[0];
        this.searchPageParams.equipment = this.equipment;
      } else {
        this.equipment = null;
        this.searchPageParams.equipment = null;
      }
    }
  }

  getDefectsList(first, refresher?) {
    if (!refresher) {
      this.mutilservice.showLoading();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      queryFlag: this.searchPageParams.queryFlag,
      defectCode: (this.searchPageParams && this.searchPageParams.defectCode) || null,
      stationId: (this.searchPageParams && this.searchPageParams.stationId) || null,
      startReportTime:
        (this.searchPageParams && this.searchPageParams.startReportTime) ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endReportTime:
        (this.searchPageParams && this.searchPageParams.endReportTime) ||
        moment().format('YYYY-MM-DD'),
      defectStatus: (this.searchPageParams && this.searchPageParams.defectStatus) || null,
      responsiblePerson:
        (this.searchPageParams &&
          this.searchPageParams.responsiblePerson &&
          this.searchPageParams.responsiblePerson.userId) ||
        null,
      deviceId:
        (this.searchPageParams &&
          this.searchPageParams.equipment &&
          this.searchPageParams.equipment.deviceId) ||
        '',
      page: this.page,
      size: 10,
    };
    this.defesservice.getDefectsList({ ...params }).subscribe((res) => {
      if (res) {
        this.defectsList = res.content;
      }
      if (refresher) refresher.complete();
      this.mutilservice.hideLoading();
    });
  }
  doRefresh(refresher: { complete: () => void }) {
    // let fTimer: any | null = null;
    // let _that = this;

    // if (fTimer) {
    //   return false;
    // }
    // fTimer = setTimeout(() => {
    //   fTimer = null;
    //   _that.getDefectsList(true, refresher);
    // }, 2000);
    this.debounceservice.throttle(this.getDefectsList(true, refresher), 2000);
  }

/**
 * 节流方法
 * @param infiniteScroll 节流的事件
 * @param delay 节流的毫秒数
 */
  deBounceFnc(infiniteScroll: { complete: () => void }, delay) {
    let timer: any | null = null;

    if (timer) {
      return false;
    }
    timer = setTimeout(() => {
      timer = null;
      this.doInfinite(infiniteScroll)
      // fn.apply(ctx, args);
    }, delay);
  }

  doInfinite(infiniteScroll: { complete: () => void }) {
    this.page++;
    const params = {
      queryFlag: this.searchPageParams.queryFlag,
      defectCode: (this.searchPageParams && this.searchPageParams.defectCode) || null,
      stationId: (this.searchPageParams && this.searchPageParams.stationId) || null,
      startReportTime:
        (this.searchPageParams && this.searchPageParams.startReportTime) ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endReportTime:
        (this.searchPageParams && this.searchPageParams.endReportTime) ||
        moment().format('YYYY-MM-DD'),
      defectStatus: (this.searchPageParams && this.searchPageParams.defectStatus) || [],
      responsiblePerson:
        (this.searchPageParams &&
          this.searchPageParams.responsiblePerson &&
          this.searchPageParams.responsiblePerson.userId) ||
        null,
      deviceId:
        (this.searchPageParams &&
          this.searchPageParams.equipment &&
          this.searchPageParams.equipment.deviceId) ||
        '',
      page: this.page,
      size: 10,
    };

    this.defesservice.getDefectsList({ ...params }).subscribe((res) => {
      if (res && res.content.length > 0) {
        this.defectsList = this.defectsList.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.defectsList.length >= res['totalElements']) {
        this.canInfinite = false;
      }
      infiniteScroll.complete();
    });
  }

  remind(event, defectId) {
    event.stopPropagation && event.stopPropagation();
    this.defesservice.remind(defectId).subscribe((res: string) => {
      this.mutilservice.popToastView(res);
    });
  }

  addDefect() {
    this.navCtrl.push(DefectManagementDetailsPage);
  }

  editDefect(defectId) {
    this.navCtrl.push(DefectManagementDetailsPage, {
      defectId,
    });
  }

  /**控制侧边栏 */
  serchMenu() {
    this.showMenu = true;
    setTimeout(() => {
      this.menuController.enable(true, 'search');
      this.menuController.open('search');
    }, 0);
  }

  // 快速查询
  selectQuickSearch(type) {
    if (this.searchPageParams.queryFlag === type) {
      this.searchPageParams.queryFlag = null;
    } else {
      this.searchPageParams.queryFlag = type;
    }
    this.menuController.close('search');
    this.getDefectsList(true);
  }

  // 电站选择
  selectStation() {
    let modal = this.modalCtrl.create(CommonStationPage, {});
    modal.onDidDismiss((e) => {
      if (e) {
        this.station = e;
        this.searchPageParams.stationId = e.id;
      }
    });
    modal.present({ keyboardClose: true });
  }

  // 清除电站
  clearStation(event) {
    event.stopPropagation && event.stopPropagation();
    this.searchPageParams.stationId = null;
    this.station = null;
  }

  // 负责人
  selectUser() {
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: true,
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.responsiblePerson = data.value[0];
          this.searchPageParams.responsiblePerson = this.responsiblePerson;
        }
      }
    });
    modal.present();
  }

  clearUser(event) {
    event.stopPropagation && event.stopPropagation();
    this.searchPageParams.responsiblePerson = null;
    this.responsiblePerson = null;
  }

  //缺陷状态
  selectStatusOption(status) {
    const removeItem = _.remove(this.searchPageParams.defectStatus, (n) => status === n);
    if (removeItem.length == 0) {
      this.searchPageParams.defectStatus.push(status);
    }
  }

  selectEquipment() {
    const equipment = this.equipment ? [this.equipment] : [];
    if (!this.station) {
      this.mutilservice.popToastView('请先选择电站');
      return;
    }
    this.navCtrl.push(EquipmentListPage, {
      stationId: this.station.id,
      isSingle: true,
      selectedItem: equipment,
    });
  }

  clearEquipment(event) {
    event.stopPropagation && event.stopPropagation();
    this.equipment = null;
    this.searchPageParams.equipment = null;
  }

  ok() {
    if (
      this.searchPageParams.startReportTime &&
      this.searchPageParams.endReportTime &&
      moment(this.searchPageParams.startReportTime).valueOf() >
      moment(this.searchPageParams.endReportTime).valueOf()
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
    this.getDefectsList(true);
  }

  reset() {
    this.equipment = null;
    this.station = null;
    this.searchPageParams = {
      queryFlag: '',
      defectCode: '',
      stationId: null,
      startReportTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endReportTime: moment().format('YYYY-MM-DD'),
      defectStatus: [],
      responsiblePerson: null,
      deviceId: null,
    };
  }

  getStatus(status, text) {
    return status === text
  }

}
