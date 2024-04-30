import { RepairTicketDetailsPage } from './../operations/repair-ticket-details/repair-ticket-details';
import { RepairTicketPage } from './../operations/repair-ticket/repair-ticket';
import { DefectManagementPage } from './../operations/defect-management/defect-management';
import { DeviceArchivePage } from '../device-archive/device-archive';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DeviceTopoPage } from '../device-topo/device-topo';
import { DeviceDocPage } from '../device-doc/device-doc';
import { EquipmentMessage } from '../home/equipment-message/equipment.message';
import { DefectManagementDetailsPage } from '../operations/defect-management-details/defect-management-details';
import { InventorisPage } from '../operations/inventoris/inventoris';
import { InspectionsPage } from '../operations/inspections/inspections';

/**
 * Generated class for the QrResultBarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-qr-result-bar',
    templateUrl: 'qr-result-bar.html',
})
export class QrResultBarPage {
    info: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad QrResultBarPage');
        this.info = this.navParams.get('info');
    }

    goLink(id) {
        let data = null;
        switch (id) {
            // "运行监视"
            case 'APP_DEVICE_MONITOR':
                data = {
                    page: EquipmentMessage,
                    params: {
                        deviceId: this.info.deviceId,
                    },
                };
                break;
            // "设备档案"
            case 'APP_DEVICE_ARCHIVE':
                data = {
                    page: DeviceArchivePage,
                    params: {
                        deviceId: this.info.deviceId,
                    },
                };
                break;
            // "设备连接"
            case 'APP_DEVICE_CONNECT':
                data = {
                    page: DeviceTopoPage,
                    params: {
                        deviceId: this.info.deviceId,
                        deviceName: this.info.deviceName,
                    },
                };
                break;
            // "设备文档"
            case 'APP_DEVICE_DOC':
                data = {
                    page: DeviceDocPage,
                    params: {
                        deviceId: this.info.deviceId,
                        deviceName: this.info.deviceName,
                    },
                };
                break;
            // "设备缺陷"
            case 'APP_DEFECT':
                data = {
                    page: DefectManagementPage,
                    params: {
                        equipment: {
                            deviceId: this.info.deviceId,
                            deviceName: this.info.deviceName,
                        },
                        stationId: this.info.stationId,
                        stationName: this.info.stationName,
                    },
                };

                break;
            // "新增缺陷"
            case 'APP_DEFECT_ADD':
                data = {
                    page: DefectManagementDetailsPage,
                    params: {
                        deviceId: this.info.deviceId,
                    },
                };
                break;
            // 备品备件
            case 'APP_MATERIAL':
                data = {
                    page: InventorisPage,
                    params: {
                        equipment: {
                            deviceId: this.info.deviceId,
                            deviceName: this.info.deviceName,
                        },
                        stationId: this.info.stationId,
                        stationName: this.info.stationName,
                    },
                };
                break;
            // "设备抢修单"
            case 'APP_OP_REPAIR':
                data = {
                    page: RepairTicketPage,
                    params: {
                        equipment: {
                            deviceId: this.info.deviceId,
                            deviceName: this.info.deviceName,
                        },
                        stationId: this.info.stationId,
                        stationName: this.info.stationName,
                    },
                };
                break;
            // "新增抢修单"
            case 'APP_OP_REPAIR_ADD':
                data = {
                    page: RepairTicketDetailsPage,
                    params: {
                        deviceId: this.info.deviceId,
                    },
                };
                break;
            // "巡视检查"
            case 'APP_INSPECTION':
                data = {
                    page: InspectionsPage,
                    params: {
                        equipment: {
                            deviceId: this.info.deviceId,
                            deviceName: this.info.deviceName,
                        },
                        stationId: this.info.stationId,
                        stationName: this.info.stationName,
                    },
                };
                break;
            //"检修预试"
            case 'APP_CHECKTEST':
                break;
            // "关联物料"
            case 'APP_MATERIAL':
                break;
            default:
                break;
        }
        this.viewCtrl.dismiss(data);
    }
}
