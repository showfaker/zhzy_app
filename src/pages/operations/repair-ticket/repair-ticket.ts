import { MutilService } from './../../../providers/util/Mutil.service';
import { RepairTicketsProvider } from './../../../providers/repair-tickets.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  MenuController,
  AlertController,
} from 'ionic-angular';
import * as moment from 'moment';
import { RepairTicketDetailsPage } from '../repair-ticket-details/repair-ticket-details';
import { CommonStationPage } from '../../util/common-station/common-station';
import { CommonUserPage } from '../../util/common-user/common-user';
import { BackendService } from '../../../providers/backend.service';
import * as _ from 'lodash';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';

/**
 * Generated class for the RepairTicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-repair-ticket',
  templateUrl: 'repair-ticket.html',
})
export class RepairTicketPage {
  page = 0;
  size = 10;
  searchParams: any = {
    queryFlag: '',
    startReportTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endReportTime: moment().format('YYYY-MM-DD'),
    repairStatus: [],
  };
  repairTicketList: any = [];
  canInfinite: boolean;
  freshPage: any = false;

  aQueryFlag = [
    { first: '01', second: '我的待办' },
    { first: '02', second: '我负责的' },
    { first: '03', second: '我许可的' },
    { first: '04', second: '我参与的' },
    { first: '05', second: '抄送我的' },
  ];

  customStartReportPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.startReportTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  customEndReportPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.endReportTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  customStartEndReportPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.startEndTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  customEndEndReportPickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.endEndTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  station;
  responsiblePerson;
  equipment;
  aRepairStatus: any;
  showMenu: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private repairticketsservice: RepairTicketsProvider,
    private mutilservice: MutilService,
    private menuCtrl: MenuController,
    private backendservice: BackendService,
    private alertCtrl: AlertController
  ) {
    let d = this.navParams.get('startDate');
    if (d) {
      this.searchParams.startReportTime = moment(d)
        .startOf('month')
        .format('YYYY-MM-DD');
      this.searchParams.endReportTime = moment(d)
        .endOf('month')
        .format('YYYY-MM-DD');
    }
    this.searchParams.queryFlag =
      this.navParams.get('queryFlag') === '03'
        ? '04'
        : this.navParams.get('queryFlag'); // 其他页面我参与的为03  这边控制下
  }

  ionViewDidLoad() {
    this.searchParams.stationId = this.navParams.get('stationId');
    this.searchParams.stationName = this.navParams.get('stationName');
    if (this.searchParams.stationId && this.searchParams.stationName) {
      this.station = {
        id: this.searchParams.stationId,
        title: this.searchParams.stationName,
      };
    }
    this.searchParams.equipment = this.navParams.get('equipment');
    this.equipment = this.navParams.get('equipment');
    this.getRepairTicketsList(true);
    // 获取缺陷状态
    this.backendservice
      .getProps({ typeId: 'repairStatus' })
      .subscribe((res) => {
        this.aRepairStatus = res;
      });
  }

  ionViewWillEnter() {
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.freshPage = false;
      this.getRepairTicketsList(true);
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

  ionViewWillLeave() {
    this.menuCtrl.enable(false, 'search');
  }

  public getRepairTicketsList(first, refresher?) {
    if (!refresher) {
      this.mutilservice.showLoading();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      queryFlag: this.searchParams.queryFlag || null,
      ticketCode: this.searchParams.ticketCode || null,
      stationId: this.searchParams.stationId || null,
      startReportTime:
        this.searchParams.startReportTime ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endReportTime:
        this.searchParams.endReportTime || moment().format('YYYY-MM-DD'),
      startEndTime: this.searchParams.startEndTime || null,
      endEndTime: this.searchParams.endEndTime || null,
      repairStatus: this.searchParams.repairStatus || null,
      responsiblePerson:
        (this.searchParams.responsiblePerson &&
          this.searchParams.responsiblePerson.userId) ||
        null,
      deviceId:
        (this.searchParams.equipment && this.searchParams.equipment.deviceId) ||
        '',
      page: this.page,
      size: this.size,
    };
    this.repairticketsservice.getRepairTicketsList(params).subscribe((res) => {
      if (res) {
        this.repairTicketList = res.content;
      }
      if (refresher) refresher.complete();
      this.mutilservice.hideLoading();
    });
  }

  doRefresh(refresher) {
    this.getRepairTicketsList(true, refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    const params = {
      queryFlag: this.searchParams.queryFlag,
      ticketCode: this.searchParams.ticketCode,
      stationId: this.searchParams.stationId,
      startReportTime: this.searchParams.startReportTime,
      endReportTime: this.searchParams.endReportTime,
      startEndTime: this.searchParams.startEndTime,
      endEndTime: this.searchParams.endEndTime,
      repairStatus: this.searchParams.repairStatus,
      responsiblePerson:
        this.searchParams.responsiblePerson &&
        this.searchParams.responsiblePerson.userId,
      deviceId:
        (this.searchParams.equipment && this.searchParams.equipment.deviceId) ||
        '',
      page: this.page,
      size: this.size,
    };
    this.repairticketsservice.getRepairTicketsList(params).subscribe((res) => {
      if (res && res.content.length > 0) {
        this.repairTicketList = this.repairTicketList.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.repairTicketList.length >= res['totalElements']) {
        this.canInfinite = false;
      }
      infiniteScroll.complete();
    });
  }

  remind(event, repairTicketId) {
    event.stopPropagation && event.stopPropagation();
    this.repairticketsservice
      .remind(repairTicketId)
      .subscribe((res: string) => {
        this.mutilservice.popToastView(res);
      });
  }

  addRepairTicker() {
    this.navCtrl.push(RepairTicketDetailsPage);
  }

  editRepairTicket(ticketId) {
    this.navCtrl.push(RepairTicketDetailsPage, {
      ticketId,
    });
  }

  /**控制侧边栏 */
  serchMenu() {
    this.showMenu = true;
    setTimeout(() => {
      this.menuCtrl.enable(true, 'search');
      this.menuCtrl.open('search');
    }, 0);
  }

  // 快速查询
  selectQuickSearch(type) {
    if (this.searchParams.queryFlag === type) {
      this.searchParams.queryFlag = null;
    } else {
      this.searchParams.queryFlag = type;
    }
    this.menuCtrl.close('search');
    this.getRepairTicketsList(true);
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

  selectRepairStatusOption(status) {
    const removeItem = _.remove(
      this.searchParams.repairStatus,
      (n) => status === n
    );
    if (removeItem.length == 0) {
      this.searchParams.repairStatus.push(status);
    }
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

  ok() {
    if (
      this.searchParams.startReportTime &&
      this.searchParams.endReportTime &&
      moment(this.searchParams.startReportTime).valueOf() >
        moment(this.searchParams.endReportTime).valueOf()
    ) {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '所选填报时间范围不正确',
        buttons: ['确定'],
      });
      alert.present();
      return;
    }
    if (
      this.searchParams.startEndTime &&
      this.searchParams.endEndTime &&
      moment(this.searchParams.startEndTime).valueOf() >
        moment(this.searchParams.endEndTime).valueOf()
    ) {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '所选完成时间范围不正确',
        buttons: ['确定'],
      });
      alert.present();
      return;
    }

    this.menuCtrl.close('search');
    this.getRepairTicketsList(true);
  }

  reset() {
    this.equipment = null;
    this.station = null;
    this.searchParams = {
      queryFlag: '',
      ticketCode: '',
      stationId: null,
      startReportTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endReportTime: moment().format('YYYY-MM-DD'),
      startEndTime: null,
      endEndTime: null,
      repairStatus: [],
      responsiblePerson: null,
      deviceId: null,
    };
  }
}
