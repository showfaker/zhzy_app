import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ModalController,
    AlertController,
    ViewController
} from 'ionic-angular';
import { CommonUserPage } from '../../common-user/common-user';
import { CommonStationPage } from '../../common-station/common-station';
import moment from 'moment';

/**
 * Generated class for the OperateTicketsSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-operate-tickets-search',
    templateUrl: 'operate-tickets-search.html'
})
export class OperateTicketsSearchPage {
    aQueryFlag = [
        { first: '01', second: '我的待办' },
        { first: '02', second: '我负责的' },
        { first: '03', second: '抄送我的' }
    ];

    customStartOperatePickerOptions = {
        buttons: [
            {
                text: '清除',
                handler: () => (this.startOperateTime = null)
            }
        ],
        cssClass: 'hiddenCancelButton'
    };
    customEndOperatePickerOptions = {
        buttons: [
            {
                text: '清除',
                handler: () => (this.endOperateTime = null)
            }
        ],
        cssClass: 'hiddenCancelButton'
    };
    searchParams: any;
    queryFlag: any;
    ticketCode: any;
    station: { id: any; title: any };
    startOperateTime: any;
    endOperateTime: any;
    executor: any;
    supervisior: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private viewCtrl: ViewController
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad OperateTicketsSearchPage');
        this.searchParams = this.navParams.get('searchParams');
        this.queryFlag = this.searchParams.queryFlag;
        this.ticketCode = this.searchParams.ticketCode;
        this.station = this.searchParams.stationId
            ? { id: this.searchParams.stationId, title: this.searchParams.stationName }
            : null;
        this.startOperateTime = this.searchParams.startOperateTime;
        this.endOperateTime = this.searchParams.endOperateTime;
        this.executor = this.searchParams.executor;
        this.supervisior = this.searchParams.supervisior;
    }

    selectQuickSearch(type) {
        if (this.queryFlag === type) {
            this.queryFlag = null;
        } else {
            this.queryFlag = type;
        }
        this.ok();
    }

    // 电站选择
    selectStation() {
        let modal = this.modalCtrl.create(CommonStationPage, {});
        modal.onDidDismiss((e) => {
            if (e) {
                this.station = e;
            }
        });
        modal.present({ keyboardClose: true });
    }

    clearStation(event) {
        event.stopPropagation && event.stopPropagation();
        this.station = null;
    }

    selectUser(key) {
        const modal = this.modalCtrl.create(CommonUserPage, {
            isSingle: true
        });
        modal.onDidDismiss((data) => {
            if (data) {
                if (data.type == 'ok') {
                    this[key] = data.value[0];
                }
            }
        });
        modal.present();
    }

    clearUser(event, key) {
        event.stopPropagation && event.stopPropagation();
        this[key] = null;
    }

    ok() {
        const params = {
            queryFlag: this.queryFlag,
            ticketCode: this.ticketCode,
            stationId: this.station && this.station.id,
            stationName: this.station && this.station.title,
            startOperateTime: this.startOperateTime,
            endOperateTime: this.endOperateTime,
            executor: this.executor,
            supervisior: this.supervisior
        };
        if (
            this.startOperateTime &&
            this.endOperateTime &&
            moment(this.startOperateTime).valueOf() > moment(this.endOperateTime).valueOf()
        ) {
            let alert = this.alertCtrl.create({
                title: '提示',
                subTitle: '所选操作时间范围不正确',
                buttons: ['确定']
            });
            alert.present();
            return;
        }
        this.viewCtrl.dismiss({ value: params, type: 'ok' });
    }

    reset() {
        this.queryFlag = null;
        this.ticketCode = null;
        this.station = null;
        this.startOperateTime = moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD');
        this.endOperateTime = moment().format('YYYY-MM-DD');
        this.executor = null;
        this.supervisior = null;
    }
}
