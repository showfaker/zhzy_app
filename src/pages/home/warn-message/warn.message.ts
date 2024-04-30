import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { alarmlogsService } from '../../../providers/alarmlogs.service';
import { WarnSearchPage } from '../../util/modal/warn-search/warn-search';
import { WarnDetails } from '../warn-details/warn.details';
import { MutilService } from './../../../providers/util/Mutil.service';

@Component({
  selector: 'warn-message',
  templateUrl: 'warn.message.html',
})
export class WarnMessage {
  title = '';
  startDate = null;
  endDate = null;
  aAlarmTypes = [];
  aAlarmLevels = [];
  aAlarmStatus = [];

  alarmList = [];
  queryParams: {
    startDate: string;
    endDate: string;
    stationId?: string;
    deviceId?: string;
    alarmLevels?: string;
    alarmTypes?: string;
    alarmStatus?: string;
  };
  page: number = 0;
  initData: {
    startDate: any;
    endDate: any;
    aAlarmTypes: any;
    aAlarmStatus: any;
    aAlarmLevels: any;
  };
  canInfinite: boolean;
  station: any;
  equipment: any;
  queryYears: any;

  constructor(
    private alarmlogsService: alarmlogsService,
    private mutilservice: MutilService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private navparams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefectManagementPage');
    this.station = this.navparams.get('station');
    this.equipment = this.navparams.get('equipment');
    this.queryYears = this.navparams.get('queryYears');
    this.alarmlogsInit(this.queryYears);
  }

  alarmlogsInit(queryYears?) {
    this.alarmlogsService.getalarmlogsInit().subscribe((res: any) => {
      this.title = res.title;
      this.initData = {
        startDate: queryYears
          ? moment().subtract(1, 'years').valueOf()
          : res.startDate,
        endDate: queryYears ? moment().valueOf() : res.endDate,
        aAlarmTypes: res.alarmTypes,
        aAlarmStatus: res.alarmStatus,
        aAlarmLevels: res.alarmLevels,
      };
      this.queryParams = {
        startDate: moment(this.initData.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.initData.endDate).format('YYYY-MM-DD'),
        alarmStatus: '1',
      };
      this.queryAlarmlog(true);
    });
  }

  queryAlarmlog(first, refresher?) {
    if (!refresher) {
      this.mutilservice.showLoading();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      page: this.page,
      size: 10,
      stationId: this.station && this.station.id,
      deviceId: this.equipment && this.equipment.deviceId,
      ...this.queryParams,
    };
    this.alarmlogsService.getalarmlogs(params).subscribe((res: any) => {
      if (res) {
        this.alarmList = res.content;
      }
      if (refresher) refresher.complete();
      this.mutilservice.hideLoading();
    });
  }

  openSearchBar() {
    let modal = this.modalCtrl.create(
      WarnSearchPage,
      {
        initData: this.initData,
        station: this.station,
        equipment: this.equipment,
      },
      {
        enterAnimation: 'modal-from-right-enter',
        leaveAnimation: 'modal-from-right-leave',
        cssClass: 'commonSearchSideBar',
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        this.queryParams = data.queryParams;
        this.station = data.station;
        this.equipment = data.equipment;
        this.queryAlarmlog(false);
      }
    });
    modal.present();
  }

  doRefresh(refresher) {
    this.queryAlarmlog(true, refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    const params = {
      page: this.page,
      size: 10,
      stationId: this.station && this.station.id,
      deviceId: this.equipment && this.equipment.deviceId,
      ...this.queryParams,
    };

    this.alarmlogsService.getalarmlogs(params).subscribe((res: any) => {
      if (res && res.content.length > 0) {
        this.alarmList = this.alarmList.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.alarmList.length >= res['totalElements']) {
        this.canInfinite = false;
      }
      infiniteScroll.complete();
    });
  }

  editAlarm(logId) {
    this.navCtrl.push(WarnDetails, {
      logId,
    });
  }

  getIcon(icon, type) {
    return icon.substr(6).split('.')[0] === type
  }

}
