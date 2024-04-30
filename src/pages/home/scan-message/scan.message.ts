import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WarnMessage } from '../warn-message/warn.message';
import { EquipmentMessage } from '../equipment-message/equipment.message';

@Component({
    selector: 'scan-message',
    templateUrl: 'scan.message.html'
})
export class ScanMessage {
    constructor(
        public navCtrl: NavController
    ) {}
    /**
     * 告警信息
     */
    warnMessage() {
        this.navCtrl.push(WarnMessage)
    }
    /**
     * 设备检测信息
     */
    equiMessage() {
        this.navCtrl.push(EquipmentMessage)
    }
}