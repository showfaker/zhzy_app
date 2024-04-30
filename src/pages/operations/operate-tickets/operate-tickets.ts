import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
} from 'ionic-angular';
import { MutilService } from '../../../providers/util/Mutil.service';
import moment from 'moment';
import { OperateTicketsProvider } from '../../../providers/operate-tickets.service';
import { OperateTicketsSearchPage } from '../../util/modal/operate-tickets-search/operate-tickets-search';
import { OperateTicketsDetailsPage } from '../operate-tickets-details/operate-tickets-details';

/**
 * Generated class for the OperateTicketsPage page.
 * 操作票
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-operate-tickets',
  templateUrl: 'operate-tickets.html',
})
export class OperateTicketsPage {
  searchParams: any = {
    queryFlag: '',
    startOperateTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endOperateTime: moment().format('YYYY-MM-DD'),
  };
  page: number;
  size: any = 10;
  operateTicketList: any = [];
  canInfinite: boolean;
  freshPage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private operateticketsservice: OperateTicketsProvider,
    private mutilservice: MutilService
  ) {
    let d = this.navParams.get('startDate');
    if (d) {
      this.searchParams.startOperateTime = moment(d)
        .startOf('month')
        .format('YYYY-MM-DD');
      this.searchParams.endOperateTime = moment(d)
        .endOf('month')
        .format('YYYY-MM-DD');
    }
    this.searchParams.queryFlag = this.navParams.get('queryFlag');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OperateTicketsPage');
    this.getOperateTicketsList(true);
  }

  ionViewWillEnter() {
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.freshPage = false;
      this.getOperateTicketsList(true);
    }
  }

  openSearchBar() {
    let modal = this.modalCtrl.create(
      OperateTicketsSearchPage,
      {
        searchParams: this.searchParams,
      },
      {
        enterAnimation: 'modal-from-right-enter',
        leaveAnimation: 'modal-from-right-leave',
        cssClass: 'commonSearchSideBar',
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.searchParams = data.value;
          this.getOperateTicketsList(false);
        }
      }
    });
    modal.present();
  }

  public getOperateTicketsList(first, refresher?) {
    if (!refresher) {
      this.mutilservice.showLoading();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      queryFlag: this.searchParams.queryFlag,
      ticketCode: this.searchParams.ticketCode || null,
      stationId: this.searchParams.stationId || null,
      startOperateTime:
        this.searchParams.startOperateTime ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endOperateTime:
        this.searchParams.endOperateTime || moment().format('YYYY-MM-DD'),
      executor:
        (this.searchParams.executor && this.searchParams.executor.userId) ||
        null,
      supervisior:
        (this.searchParams.supervisior &&
          this.searchParams.supervisior.userId) ||
        null,
      page: this.page,
      size: this.size,
    };
    this.operateticketsservice
      .getOperateTicketsList(params)
      .subscribe((res) => {
        if (res) {
          this.operateTicketList = res.content;
        }
        if (refresher) refresher.complete();
        this.mutilservice.hideLoading();
      });
  }

  doRefresh(refresher) {
    this.getOperateTicketsList(true, refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    const params = {
      queryFlag: this.searchParams.queryFlag,
      ticketCode: this.searchParams.ticketCode,
      stationId: this.searchParams.stationId,
      startOperateTime: this.searchParams.startOperateTime,
      endOperateTime: this.searchParams.endOperateTime,
      executor: this.searchParams.executor && this.searchParams.executor.userId,
      supervisior:
        this.searchParams.supervisior && this.searchParams.supervisior.userId,
      page: this.page,
      size: this.size,
    };

    this.operateticketsservice
      .getOperateTicketsList(params)
      .subscribe((res) => {
        if (res && res.content.length > 0) {
          this.operateTicketList = this.operateTicketList.concat(
            res['content']
          );
        } else {
          this.page--;
        }
        if (this.operateTicketList.length >= res['totalElements']) {
          this.canInfinite = false;
        }
        infiniteScroll.complete();
      });
  }

  addOperateTicker() {
    this.navCtrl.push(OperateTicketsDetailsPage);
  }

  editOperateTicket(ticketId) {
    this.navCtrl.push(OperateTicketsDetailsPage, {
      ticketId,
    });
  }
}
