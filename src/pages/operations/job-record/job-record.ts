import { RunLogService } from './../../../providers/runlog.service';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  MenuController,
  LoadingController,
} from 'ionic-angular';
import { CommonStationPage } from '../../util/common-station/common-station';
import * as moment from 'moment';
import { JobRecordDetailsPage } from '../job-record-details/job-record-details';
import { JobRecordSearchPage } from '../../util/modal/job-record-search/job-record-search';

/**
 * Generated class for the JobRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-job-record',
  templateUrl: 'job-record.html',
})
export class JobRecordPage {
  station: any;
  startTime: any = moment().subtract(30, 'days').format('YYYY-MM-DD');
  endTime: any = moment().format('YYYY-MM-DD');
  status = 1;
  page: any;
  stationId: any;
  jobRecordList: any;
  stationName: any;
  canInfinite: boolean = true;
  loadedStatus: string = 'status1';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public menuCtrl: MenuController,
    private runlogservice: RunLogService,
    private loadingCtrl: LoadingController,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobRecordPage222');
    this.query(true);
  }
  /** every come into page query  **/
  ionViewWillEnter() {
    console.log('ionViewDidLoad JobRecordPage333');
    this.query(true);
  }

  // 打开右侧条件筛选
  openSearchBar() {
    let modal = this.modalCtrl.create(
      JobRecordSearchPage,
      {
        stationId: this.stationId,
        stationName: this.stationName,
        status: this.status,
      },
      {
        enterAnimation: 'modal-from-right-enter',
        leaveAnimation: 'modal-from-right-leave',
        cssClass: 'commonSearchSideBar',
      },
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.stationId = data.value.stationId;
          this.stationName = data.value.stationName;
          this.startTime = data.value.startTime;
          this.endTime = data.value.endTime;
          this.status = data.value.status;
          this.query(true);
        }
      }
    });
    modal.present();
  }

  // 电站选择
  selectStation() {
    let modal = this.modalCtrl.create(CommonStationPage, {});
    modal.onDidDismiss((e) => {
      if (e) {
        this.station = e;
        if (e.id) {
          this.addJobRecord(e.id);
        }
      }
    });
    modal.present({ keyboardClose: true });
  }

  query(first, refresher?) {
    let loading = null;
    if (!refresher) {
      loading = this.loadingCtrl.create({
        spinner: 'crescent',
      });

      loading.present();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      stationId: this.stationId ? this.stationId : null,
      startTime: this.startTime
        ? this.startTime
        : moment().subtract(29, 'day').format('YYYY-MM-DD'),
      endTime: this.endTime ? this.endTime : moment().format('YYYY-MM-DD'),
      status: this.status,
      page: this.page,
      size: 10,
    };
    this.runlogservice.getRecordsList(params).subscribe((res) => {
      this.jobRecordList = res.content;
      this.loadedStatus = this.status === 1 ? 'status1' : 'status0';
      if (refresher) refresher.complete();
      if (loading) {
        loading.dismiss();
      }
    });
  }

  doRefresh(refresher: { complete: () => void }) {
    this.query(true, refresher);
  }

  doInfinite(infiniteScroll: { complete: () => void }) {
    this.page++;
    const params = {
      stationId: this.stationId ? this.stationId : null,
      startTime: this.startTime
        ? this.startTime
        : moment().subtract(29, 'day').format('YYYY-MM-DD'),
      endTime: this.endTime ? this.endTime : moment().format('YYYY-MM-DD'),
      status: this.status,
      page: this.page,
      size: 10,
    };

    this.runlogservice.getRecordsList(params).subscribe((res) => {
      if (res && res.content.length > 0) {
        this.jobRecordList = this.jobRecordList.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.jobRecordList.length >= res['totalElements']) {
        this.canInfinite = false;
      }
      infiniteScroll.complete();
    });
  }

  editJobRecord(recordId, loadedStatus) {
    if (loadedStatus === 'status0') {
      return;
    }
    this.navCtrl.push(JobRecordDetailsPage, {
      stationId: null,
      recordId,
    });
  }

  addJobRecord(stationId?) {
    if (!this.stationId) {
      if (stationId) {
        this.navCtrl.push(JobRecordDetailsPage, {
          stationId: stationId,
        });
      } else {
        this.selectStation();
      }
    } else {
      this.navCtrl.push(JobRecordDetailsPage, {
        stationId: this.stationId,
      });
    }
  }

  closeSearchBar() {
    this.menuCtrl.close();
  }
}
