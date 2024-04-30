import { RepairTicketDetailsPage } from './../../../operations/repair-ticket-details/repair-ticket-details';
import { MutilService } from './../../../../providers/util/Mutil.service';
import { MaterialService } from './../../../../providers/material.service';
import { DefectManagementDetailsPage } from './../../../operations/defect-management-details/defect-management-details';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController
} from 'ionic-angular';

/**
 * Generated class for the CommonDefectCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-defect-code',
  templateUrl: 'common-defect-code.html'
})
export class CommonDefectCodePage {
  value: any = {
    relaBusinessCode: null,
    relaBusinessId: null
  };
  title: any;
  type: any = 'text';
  from: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private materialservice: MaterialService,
    private mutilservice: MutilService,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonInputPage');
    this.title = this.navParams.get('title');
    this.value = this.navParams.get('value') || {
      relaBusinessCode: null,
      relaBusinessId: null
    };
    this.type = this.navParams.get('type');
  }

  ok() {
    if (this.value.relaBusinessCode) {
      this.checkDefectCode((res) => {
        this.viewCtrl.dismiss({
          value: {
            relaBusinessCode: this.value.relaBusinessCode,
            relaBusinessId: res.orderId
          },
          type: 'ok'
        });
      });
    } else {
      const alert = this.alertCtrl.create({
        title: '警告',
        subTitle: `请输入${this.title}`,
        buttons: ['确认']
      });
      alert.present();
      return;
    }
  }

  clear() {
    this.viewCtrl.dismiss({
      value: {
        relaBusinessCode: null,
        relaBusinessId: null
      },
      type: 'clear'
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }

  goDefectManagementDetail() {
    this.checkDefectCode((res) => {
      switch (res.orderType) {
        case '01': //缺陷单
          this.navCtrl.push(DefectManagementDetailsPage, {
            defectId: this.value.relaBusinessId
          });
          break;
        case '02':
          // todo 巡检单
          break;
        case '03':
          // todo 维护单
          break;
        case '04':
          // todo 检修预试单
          break;
        case '05':
          // todo 技改单
          break;
        case '06':
          // todo 工作票
          break;
        case '07':
          // todo 操作票
          break;
        case '08': //抢修单
          this.navCtrl.push(RepairTicketDetailsPage, {
            ticketId: this.value.relaBusinessId
          });
          break;
        case '09':
          // todo 清洗单
          break;
        default:
          break;
      }
    });
  }

  checkDefectCode(fn) {
    return this.materialservice
      .getOrderIdByOrderCode(this.value.relaBusinessCode)
      .subscribe((res) => {
        if (res) {
          return fn(res);
        } else {
          this.mutilservice.popToastView('单号不存在！');
        }
      });
  }
}
