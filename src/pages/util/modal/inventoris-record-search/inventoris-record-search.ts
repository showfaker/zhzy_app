import { Component } from '@angular/core';
import {
  ModalController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonIotypesPage } from '../../common-iotypes/common-iotypes';
import { CommonMaterialsPage } from '../../common-materials/common-materials';
import { CommonUserPage } from '../../common-user/common-user';
import { CommonWarehousePage } from '../../common-warehouse/common-warehouse';
import { BackendService } from './../../../../providers/backend.service';
import { MutilService } from './../../../../providers/util/Mutil.service';

/**
 * Generated class for the JobRecordSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventoris-record-search',
  templateUrl: 'inventoris-record-search.html',
})
export class InventorisRecordSearchPage {
  aQueryFlag = [
    { first: '1', second: '我的申请' },
    { first: '2', second: '我的审批/确认' },
    { first: '3', second: '我的代办' },
    { first: '4', second: '抄送我的' },
  ];

  searchParams: any = {
    myOperate: '3',
    ioSubTypes: [],
    materia: [],
    warehouseId: null,
    startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    ioStatus: [],
    materialName: null,
    operator: null,
    approver: null,
  };

  customStartTimePickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.startTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  customEndTimePickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => (this.searchParams.endTime = null),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  status: any;
  ioStatus: any;
  warehouses: any;
  userType: any;
  materialType: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private backendservice: BackendService,
    private mutilservice: MutilService
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventorisRecordSearchPage');
    this.backendservice
      .getProps({ typeId: 'iostorageStatus' })
      .subscribe((res) => {
        this.ioStatus = res;
      });
    this.searchParams = this.navParams.get('searchParams');
    this.materialType = this.navParams.get('materialType') || '01';

    const { warehouseId, warehouseName } = this.searchParams;
    if (warehouseId && warehouseName) {
      this.warehouses = { warehouseId, warehouseName };
    }
  }

  selectStatusOption(status) {
    const removeItem = _.remove(
      this.searchParams.ioStatus,
      (n) => status === n
    );
    if (removeItem.length == 0) {
      this.searchParams.ioStatus.push(status);
    }
  }

  public setIoSubType() {
    const modal = this.modalCtrl.create(CommonIotypesPage, {
      ioSubTypes: this.searchParams.ioSubTypes || [],
      materialType: this.materialType,
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type) {
          this.searchParams.ioSubTypes = data.value;
        }
      }
    });
    modal.present();
  }

  clearIoSubType() { }

  // 仓库选择
  selectWarehouses() {
    let modal = this.modalCtrl.create(CommonWarehousePage);
    modal.onDidDismiss((e) => {
      if (e) {
        if (e.type === 'ok') {
          this.warehouses = e.value;
          if (!_.isEmpty(this.warehouses)) {
            this.searchParams.warehouseId = e.value.warehouseId;
            this.searchParams.warehouseName = e.value.warehouseName;
          }
        } else {
          this.warehouses = null;
          this.searchParams.warehouseId = null;
          this.searchParams.warehouseName = null;
        }
      }
    });
    modal.present({ keyboardClose: true });
  }

  clearWarehouses(event) {
    event.stopPropagation();
    this.warehouses = null;
    this.searchParams.warehouseId = null;
    this.searchParams.warehouseName = null;
  }

  // 负责人
  selectUser(type) {
    this.userType = type;
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: true,
      selectedItem: [
        {
          userId:
            this.searchParams[this.userType] &&
            this.searchParams[this.userType].userId,
        },
      ],
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.searchParams[this.userType] = data.value[0];
        }
      }
    });
    modal.present();
  }

  clearUser(event, type) {
    this.userType = type;
    event.stopPropagation && event.stopPropagation();
    this.searchParams[this.userType] = null;
  }

  selectQuickSearch(type) {
    if (this.searchParams.myOperate === type) {
      this.searchParams.myOperate = null;
    } else {
      this.searchParams.myOperate = type;
    }
    this.viewCtrl.dismiss({
      value: {
        ...this.searchParams,
        myOperate: this.searchParams.myOperate,
      },
      type: 'ok',
    });
  }

  ok() {
    this.viewCtrl.dismiss({ value: { ...this.searchParams }, type: 'ok' });
  }

  reset() {
    this.viewCtrl.dismiss({
      value: {
        myOperate: '3',
        ioSubTypes: [],
        materia: [],
        warehouseId: null,
        startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        ioStatus: [],
        materialName: null,
        operator: null,
        approver: null,
      },
      type: 'reset',
    });
  }

  //物料选择
  selectMaterials() {
    if (!this.warehouses) {
      return this.mutilservice.popToastView('请先选择仓库');
    }
    let modal = this.modalCtrl.create(CommonMaterialsPage, {
      ioType: null,
      selectType: 'multi',
      materialType: this.materialType,
      warehouseId: this.warehouses.warehouseId || null,
      selectedItem: this.searchParams.materia || [],
    });
    modal.onDidDismiss((e) => {
      if (e) {
        if (e.type == 'ok') {
          this.searchParams.materia = e.value;
        } else {
          this.searchParams.materia = [];
        }
      }
    });
    modal.present({ keyboardClose: true });
  }
}
