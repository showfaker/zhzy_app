import { HomeService } from './../../../providers/home.service';
import { MonitorService } from './../../../providers/monitor.service';
import { MutilService } from './../../../providers/util/Mutil.service';
import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ViewController,
    MenuController,
    ModalController,
    LoadingController,
} from 'ionic-angular';
import moment from 'moment';
import { CommonStationPage } from '../../util/common-station/common-station';

/**
 * Generated class for the ReportProductionMonthlyLyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-report-production-monthly-ly',
    templateUrl: 'report-production-monthly-ly.html',
})
export class ReportProductionMonthlyLyPage {
    modules: any;
    searchParams: any;
    title: any;
    settleMonth: any;
    station: any;
    showMenu: boolean = false;
    reportInfo: any;
    month: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        private menuController: MenuController,
        private mUtil: MutilService,
        private modalCtrl: ModalController,
        private monitorservice: MonitorService,
        private homeservice: HomeService,
        private loadingCtrl: LoadingController
    ) {
        this.modules = this.navParams.get('param');
        this.searchParams = {};
        this.title = this.navParams.get('title');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ReportProductionMonthlyLyPage');
        this.searchParams.settleMonth = moment().startOf('month').format();
        this.month = moment(this.searchParams.settleMonth).get('month') + 1;
        this.monitorservice
            .getsummary()
            .toPromise()
            .then((res: any) => {
                this.searchParams.station = {
                    id: res.stationId,
                    title: res.stationName,
                };
            })
            .then(() => {
                this.getReportProductionMonthlyLy();
            });
    }

    /**重置 */
    reset() {
        this.monitorservice.getsummary().subscribe((res: any) => {
            this.searchParams.station = {
                id: res.stationId,
                title: res.stationName,
            };
        });
        this.searchParams.settleMonth = moment().startOf('month').format();
    }

    backupsModulesDetails; //打开侧边栏时备份筛选条件
    /**搜索菜单打开时 */
    menuInit() {
        this.backupsModulesDetails = JSON.parse(JSON.stringify(this.searchParams));
    }

    /**控制侧边栏 */
    serchMenu() {
        this.showMenu = true;
        setTimeout(() => {
            this.menuController.enable(true, 'reportProductionMonthlyLySearch');
            this.menuController.open('reportProductionMonthlyLySearch');
        }, 0);
    }

    // 电站选择
    selectStation() {
        let modal = this.modalCtrl.create(CommonStationPage, {});
        modal.onDidDismiss((e) => {
            if (e) {
                this.searchParams.station = e;
            }
        });
        modal.present({ keyboardClose: true });
    }

    clearStation(event) {
        event.stopPropagation && event.stopPropagation();
        this.searchParams.station = null;
    }

    /**查询 */
    ok() {
        this.backupsModulesDetails = JSON.parse(JSON.stringify(this.searchParams));
        this.menuController.close('reportProductionMonthlyLySearch');
        this.getReportProductionMonthlyLy();
    }

    public getReportProductionMonthlyLy() {
        if (!(this.searchParams.station && this.searchParams.station.id)) {
            this.mUtil.popToastView('电站不能为空');
            return;
        }
        if (!this.searchParams.settleMonth) {
            this.mUtil.popToastView('月份不能为空');
            return;
        }
        const params = {
            stationId: this.searchParams.station.id,
            settleMonth: moment(this.searchParams.settleMonth).format('YYYY-MM-DD'),
        };
        let loading = null;
        loading = this.loadingCtrl.create({
            spinner: 'crescent',
        });
        loading.present();
        this.homeservice.getReportProductionMonthlyLy(params).subscribe(
            (res: any) => {
                this.month = moment(params.settleMonth).get('month') + 1;
                this.reportInfo = res;
            },
            () => {
                if (loading) {
                    loading.dismiss();
                }
            },
            () => {
                if (loading) {
                    loading.dismiss();
                }
            }
        );
    }
}
