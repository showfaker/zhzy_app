import { InspectionsMenusPage } from './inspections-menus/inspections-menus';
import { InspectionsProvider } from './../../../providers/inspections.service';
import {
  Events,
  AlertController,
  ModalController,
  PopoverController,
} from 'ionic-angular';
import { MutilService } from './../../../providers/util/Mutil.service';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import * as moment from 'moment';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonStationPage } from '../../util/common-station/common-station';
import { InspectionsDetailsPage } from '../inspections-details/inspections-details';
import { DebounceService } from '../../../providers/debounce.service';

/**
 * Generated class for the InspectionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 巡检单
 */

@Component({
  selector: 'page-inspections',
  templateUrl: 'inspections.html',
})
export class InspectionsPage {
  inspectionsList = [];
  showMenu = false;

  // 查询条件
  aQueryFlag = [
    { first: '01', second: '我的待办' },
    { first: '02', second: '我负责的' },
    { first: '03', second: '我参与的' },
    { first: '04', second: '抄送我的' },
  ];

  station = null;

  customStartTimePickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.startTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  customEndTimePickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.endTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };

  responsiblePerson = null;

  equipment = null;

  searchParams: any = {
    queryFlag: null,
    startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    ispectionCode: null,
    stationId: null,
    responsiblePerson: null,
  };
  page: number = 0;
  size = 10;
  popover: any;
  canInfinite: boolean;
  freshPage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private events: Events,
    private modalCtrl: ModalController,
    private mutilservice: MutilService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private inspectionsprovider: InspectionsProvider,
    private debounceservice: DebounceService
  ) {

console.log("constructor:-navParams:");
console.log(navParams);

    let d = this.navParams.get('startDate');
    if (d) {
      this.searchParams.startTime = moment(d)
        .startOf('month')
        .format('YYYY-MM-DD');
      this.searchParams.endTime = moment(d).endOf('month').format('YYYY-MM-DD');
    }
    this.searchParams.queryFlag = this.navParams.get('queryFlag');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionsPage');
    if (this.navParams.get('stationId')) {
      this.station = {
        title: this.navParams.get('stationName'),
        id: this.navParams.get('stationId'),
      };
      this.searchParams.stationId = this.navParams.get('stationId');
    }
    this.equipment = this.navParams.get('equipment');
    this.searchParams.equipment = this.equipment;
    this.getInspectionsList(true);
  }

  ionViewWillEnter() {
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.freshPage = false;
      this.getInspectionsList(true);
    }
    const equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      this.navParams.data.equipmentList = [];
      if (equipmentList.length > 0) {
        this.equipment = equipmentList[0];
        this.searchParams.equipment = this.equipment;
      } else {
        this.equipment = null;
        this.searchParams.equipment = null;
      }
    }
  }

  // 获取巡检列表
  getInspectionsList(first, refresher?) {
    if (!refresher) {
      this.mutilservice.showLoading();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      queryFlag: this.searchParams.queryFlag,
      ispectionCode: this.searchParams.ispectionCode,
      stationId: this.searchParams.stationId,
      startTime:
        this.searchParams.startTime ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endTime: this.searchParams.endTime || moment().format('YYYY-MM-DD'),
      responsiblePerson:
        this.searchParams.responsiblePerson &&
        this.searchParams.responsiblePerson.userId,
      deviceId:
        (this.searchParams.equipment && this.searchParams.equipment.deviceId) ||
        null,
      page: this.page,
      size: this.size,
    };
    this.inspectionsprovider.getInspectionsList(params).subscribe((res) => {
      if (res) {
        this.inspectionsList = res.content;
      }
      if (refresher) refresher.complete();
      this.mutilservice.hideLoading();
    });
  }

  // 搜素
  searchMenu() {
    this.showMenu = true;
    setTimeout(() => {
      this.menuCtrl.enable(true, 'search');
      this.menuCtrl.open('search');
    }, 0);
  }

  //新增巡检单
  public addInspections(myEvent) {
    this.popover = this.popoverCtrl.create(
      InspectionsMenusPage,
      {},
      {
        cssClass: 'inspectionsMenus',
        showBackdrop: true,
      }
    );
    this.popover.onDidDismiss((res) => {
      if (res) {
        this.navCtrl.push(InspectionsDetailsPage, {
          type: 'add',
          inspectionType: res.type,
        });
      }
    });
    this.popover.present({
      ev: myEvent,
    });
  }

  // 下拉刷新
  doRefresh(refresher: { complete: () => void }) {
    this.debounceservice.throttle(this.getInspectionsList(true, refresher), 2000);
    // this.getInspectionsList(true, refresher);
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

  // 加载更多
  doInfinite(infiniteScroll: { complete: () => void }) {
    this.page++;
    const params = {
      queryFlag: this.searchParams.queryFlag,
      ispectionCode: this.searchParams.ispectionCode,
      stationId: this.searchParams.stationId,
      startTime:
        this.searchParams.startTime ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endTime: this.searchParams.endTime || moment().format('YYYY-MM-DD'),
      responsiblePerson:
        this.searchParams.responsiblePerson &&
        this.searchParams.responsiblePerson.userId,
      deviceId:
        (this.searchParams.equipment && this.searchParams.equipment.deviceId) ||
        null,
      page: this.page,
      size: this.size,
    };

    this.inspectionsprovider
      .getInspectionsList({ ...params })
      .subscribe((res) => {
        if (res && res.content.length > 0) {
          this.inspectionsList = this.inspectionsList.concat(res['content']);
        } else {
          this.page--;
        }
        if (this.inspectionsList.length >= res['totalElements']) {
          this.canInfinite = false;
        }
        infiniteScroll.complete();
      });
  }

  // 查看/编辑 巡检单
  editInspections(id, type) {
    this.navCtrl.push(InspectionsDetailsPage, {
      inspectionId: id,
      inspectionType: type,
    });
  }

  // 快速查询
  selectQuickSearch(type) {
    if (this.searchParams.queryFlag === type) {
      this.searchParams.queryFlag = null;
    } else {
      this.searchParams.queryFlag = type;
    }
    this.menuCtrl.close('search');
    this.getInspectionsList(true);
  }

  // 电站选择
  selectStation() {
    let modal = this.modalCtrl.create(CommonStationPage, {});
    modal.onDidDismiss((e) => {
      if (e) {
        this.station = e;
        this.searchParams.stationId = e.id;
      }
    });
    modal.present({ keyboardClose: true });
  }

  // 清除电站
  clearStation(event) {
    event.stopPropagation && event.stopPropagation();
    this.searchParams.stationId = null;
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
          this.searchParams.responsiblePerson = this.responsiblePerson;
        }
      }
    });
    modal.present();
  }

  clearUser(event) {
    event.stopPropagation && event.stopPropagation();
    this.searchParams.responsiblePerson = null;
    this.responsiblePerson = null;
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
    this.searchParams.equipment = null;
  }

  // 查询按钮
  ok() {
    if (
      this.searchParams.startTime &&
      this.searchParams.endTime &&
      moment(this.searchParams.startTime).valueOf() >
        moment(this.searchParams.endTime).valueOf()
    ) {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '所选巡检时间范围不正确',
        buttons: ['确定'],
      });
      alert.present();
      return;
    }
    this.menuCtrl.close('search');
    this.getInspectionsList(true);
  }

  reset() {
    this.equipment = null;
    this.station = null;
    this.searchParams = {
      queryFlag: null,
      ispectionCode: null,
      stationId: null,
      startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
      responsiblePerson: null,
      deviceId: null,
    };
  }
}
