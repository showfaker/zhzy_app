import { MutilService } from './../../../providers/util/Mutil.service';
import { Component } from '@angular/core';
import {
    NavController,
    NavParams,
    ModalController,
    MenuController,
    ViewController,
} from 'ionic-angular';
import { OperationsService } from '../../../providers/operations.service';
import { DefectManagementPage } from '../defect-management/defect-management';
import { OperateTicketsPage } from '../operate-tickets/operate-tickets';
import { RepairTicketPage } from '../repair-ticket/repair-ticket';
import { MaintainsPage } from '../maintains/maintains';
import { InspectionsPage } from '../inspections/inspections';
import * as moment from 'moment';

@Component({
    selector: 'order-page',
    templateUrl: 'order.page.html',
})
export class OrderPage {
    workbenchOrdersList = [];
    dataType;
    startDate;
    endDate;
    status;
    constructor(
        private operationsService: OperationsService,
        private mutilservice: MutilService,
        private menuController: MenuController,
        private viewCtrl: ViewController,
        private navparams: NavParams,
        private navCtrl: NavController
    ) {
        this.dataType = this.navparams.get('dataType');
        this.status = this.navparams.get('status');
        let singleDay = this.navparams.get('singleDay');
        let d = this.navparams.get('startDate');
        if (!singleDay) {
            this.startDate = moment(d).startOf('month').format('YYYY-MM-DD');
            this.endDate = moment(d).endOf('month').format('YYYY-MM-DD');
        } else {
            this.startDate = moment(d).format('YYYY-MM-DD');
            this.endDate = moment(d).format('YYYY-MM-DD');
        }
    }

    ionViewDidLoad() {
        this.workbenchOrders();
    }

    /**列表 */
    workbenchOrders(refresher?) {
        this.operationsService
            .workbenchOrders(this.dataType, this.status, this.startDate, this.endDate, this.page)
            .subscribe((e) => {
                // if (e) {

                //     this.workbenchOrdersList = e['content'];
                // }
                // console.log(e)
                if (e && e['content'] && e['content'].length > 0) {
                    this.workbenchOrdersList = this.workbenchOrdersList.concat(e['content']);
                    // this.modulesList = e.content;
                }
                if (this.workbenchOrdersList.length >= e.totalElements) {
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

    /**催单 */
    workbenchRemind(orderId) {
        this.operationsService.workbenchRemind(orderId).subscribe((e) => {
            this.mutilservice.popToastView(e);
        });
    }

    openSearchBar() {}

    /**查询 */
    submit() {
        this.menuController.close('orderPageSearch');

        this.workbenchOrdersList = [];

        this.workbenchOrders();
    }

    /**重置 */
    reset() {
        let back = JSON.parse(JSON.stringify(this.backupsModulesDetails));
        if (back) {
            this.status = back.status;
            this.startDate = back.startDate;
            this.endDate = back.endDate;
        }
    }

    backupsModulesDetails; //打开侧边栏时备份筛选条件
    /**搜索菜单打开时 */
    menuInit() {
        this.backupsModulesDetails = JSON.parse(
            JSON.stringify({
                status: this.status,
                startDate: this.startDate,
                endDate: this.endDate,
            })
        );
    }

    /**搜索菜单关闭时 */
    ionClose() {}

    /**控制侧边栏 */
    serchMenu() {
        this.menuController.enable(true, 'orderPageSearch');
        this.menuController.open('orderPageSearch');
    }

    changeStatus(status) {
        this.status = status;
    }
    /**时间选择 */
    changeDate(type) {
        // this[type] = this[type];
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    toPage(workbenchOrders) {
        switch (workbenchOrders.type) {
            // 缺陷管理
            case '01':
                this.navCtrl.push(DefectManagementPage);
                break;
            // 操作票
            case '07':
                this.navCtrl.push(OperateTicketsPage);
                break;
            // 抢修单
            case '08':
                this.navCtrl.push(RepairTicketPage);
                break;
            // 检修预试
            case '04':
                this.navCtrl.push(MaintainsPage);
                break;
            // 巡视检查
            case '02':
                this.navCtrl.push(InspectionsPage);
                break;
            default:
                break;
        }
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
        this.workbenchOrdersList = [];
        this.workbenchOrders(refresher);
    }

    /**
     * 上拉加载
     * @param infiniteScroll
     */
    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        this.page++;
        this.workbenchOrders(infiniteScroll);
    }
}
