import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  ModalController,
  AlertController,
  PopoverController,
} from 'ionic-angular';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { MutilService } from '../../../providers/util/Mutil.service';
import { MaintainsProvider } from '../../../providers/maintains.service';
import { MaintainsMenusPage } from './maintains-menus/maintains-menus';
import { MaintainsDetailsPage } from '../maintains-details/maintains-details';
import { CommonStationPage } from '../../util/common-station/common-station';
import { CommonUserPage } from '../../util/common-user/common-user';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';

/**
 * Generated class for the MaintainsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-maintains',
  templateUrl: 'maintains.html',
})
export class MaintainsPage {
  maintainsList = [];
  showMenu = false;

  // 查询条件
  aQueryFlag = [
    { first: '01', second: '我的待办' },
    { first: '02', second: '我参与的' },
    { first: '03', second: '抄送我的' },
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
    private modalCtrl: ModalController,
    private mutilservice: MutilService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private maintainsprovider: MaintainsProvider
  ) {
    let d = this.navParams.get('startDate');
    if (d) {
      this.searchParams.startTime = moment(d)
        .startOf('month')
        .format('YYYY-MM-DD');
      this.searchParams.endTime = moment(d).endOf('month').format('YYYY-MM-DD');
    }
    this.searchParams.queryFlag =
      this.navParams.get('queryFlag') === '03'
        ? '02'
        : this.navParams.get('queryFlag'); // 其他页面我参与的为03  这边控制下
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaintainsPage');
    const params = this.navParams.get('params') || null;
    if (params) {
      this.station = {
        title: params.stationName,
        id: params.stationId,
      };
      this.equipment = {
        deviceId: params.deviceId,
        deviceName: params.deviceName,
      };
      this.searchParams = {
        stationId: params.stationId,
        equipment: this.equipment,
        startTime: params.startTime,
        endTime: params.endTime,
      };
      this.getMaintainsList(false);
    } else {
      this.getMaintainsList(true);
    }
  }

  ionViewWillEnter() {
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.freshPage = false;
      this.getMaintainsList(true);
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
  getMaintainsList(first, refresher?) {
    if (!refresher) {
      this.mutilservice.showLoading();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      queryFlag: this.searchParams.queryFlag || null,
      ispectionCode: this.searchParams.ispectionCode || null,
      stationId: this.searchParams.stationId || null,
      startTime:
        this.searchParams.startTime ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endTime: this.searchParams.endTime || moment().format('YYYY-MM-DD'),
      responsiblePerson:
        (this.searchParams.responsiblePerson &&
          this.searchParams.responsiblePerson.userId) ||
        null,
      deviceId:
        (this.searchParams.equipment && this.searchParams.equipment.deviceId) ||
        null,
      page: this.page,
      size: this.size,
    };
    this.maintainsprovider.getMaintainsList(params).subscribe((res) => {
      if (res) {
        this.maintainsList = res.content;
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
  public addMaintains(myEvent) {
    this.popover = this.popoverCtrl.create(
      MaintainsMenusPage,
      {},
      {
        cssClass: 'maintainsMenus',
        showBackdrop: true,
      }
    );
    this.popover.onDidDismiss((res) => {
      if (res) {
        this.navCtrl.push(MaintainsDetailsPage, {
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
    this.getMaintainsList(true, refresher);
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

    this.maintainsprovider.getMaintainsList({ ...params }).subscribe((res) => {
      if (res && res.content.length > 0) {
        this.maintainsList = this.maintainsList.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.maintainsList.length >= res['totalElements']) {
        this.canInfinite = false;
      }
      infiniteScroll.complete();
    });
  }

  // 查看/编辑 巡检单
  editMaintains(id, type) {
    this.navCtrl.push(MaintainsDetailsPage, {
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
    this.getMaintainsList(true);
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
    this.getMaintainsList(true);
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
