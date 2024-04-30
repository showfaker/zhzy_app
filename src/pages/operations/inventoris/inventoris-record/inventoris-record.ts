import { Component } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
} from 'ionic-angular';
import moment from 'moment';
import { MaterialService } from '../../../../providers/material.service';
import { InventorisRecordSearchPage } from '../../../util/modal/inventoris-record-search/inventoris-record-search';
import { InventorisMenusPage } from '../inventoris-menus/inventoris-menus';
import { InventorisOutInPage } from '../inventoris-out-in/inventoris-out-in';
import { BackendService } from './../../../../providers/backend.service';

/**
 * Generated class for the InventorisRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventoris-record',
  templateUrl: 'inventoris-record.html',
})
export class InventorisRecordPage {
  page: any = 0;
  warehouseId: any;
  materialId: any;
  inventorisRecordList: any;
  canInfinite: boolean;
  showMenu: boolean = false;

  searchParams: any = {
    myOperate: '3',
    ioSubTypes: [],
    materia: [],
    materialIds: [],
    warehouseId: null,
    startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    ioStatus: [],
    materialName: null,
    operator: null,
    approver: null,
  };

  materials: any = null;
  warehouses: any;

  ioStatus: any;
  userType: any;
  popover: any;
  freshPage: any;
  materialType: any;
  materialTypesButtons: any;
  materialTypeText: any = '物资';
  materia: any[] = [];
  materialIds: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private materialservice: MaterialService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private backendservice: BackendService,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventorisRecordPage');
    this.warehouseId = this.navParams.get('warehouseId');
    this.materialId = this.navParams.get('materialId');
    this.materialType = this.navParams.get('materialType');

    this.searchParams.myOperate =
      this.navParams.get('myOperate') === null ? null : '3';
    this.searchParams.warehouseId = this.navParams.get('warehouseId');
    this.searchParams.warehouseName = this.navParams.get('warehouseName');
    this.searchParams.materia = this.navParams.get('materia');
    this.getMaterialTypes();
    this.getInventorisRecordList(true);
  }

  ionViewWillEnter() {
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.getInventorisRecordList(true);
    }
  }

  getMaterialTypes() {
    this.materialservice.getMaterialTypes().subscribe((res) => {
      this.materialTypesButtons = res.map((item) => ({
        text: item.second,
        handler: () => {
          this.materialType = item.first;
          this.materialTypeText = item.second;
          this.materia = [];
          this.searchParams.materia = [];
          this.materialIds = [];
          this.getInventorisRecordList(true);
        },
      }));
    });
  }

  select() {
    const actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: this.materialTypesButtons,
      cssClass: 'commonSheet',
    });
    actionSheet.present();
  }

  getInventorisRecordList(first, refresher?) {
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
      myOperate: this.searchParams.myOperate,
      materialType: this.materialType,
      ioSubTypes: this.searchParams.ioSubTypes || [],
      warehouseId: this.searchParams.warehouseId || null,
      materialIds:
        (this.searchParams.materia &&
          this.searchParams.materia.map((item) => item.materialId)) ||
        null,
      startTime:
        this.searchParams.startTime ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endTime: this.searchParams.endTime || moment().format('YYYY-MM-DD'),
      ioStatus: this.searchParams.ioStatus,
      operator:
        (this.searchParams.operator && this.searchParams.operator.userId) ||
        null,
      approver:
        (this.searchParams.approver && this.searchParams.approver.userId) ||
        null,
      page: this.page,
      size: 10,
    };

    this.materialservice
      .getInventorisRecordList({ ...params })
      .subscribe((res) => {
        if (res) {
          this.inventorisRecordList = res.content;
        }
        if (refresher) refresher.complete();
        if (loading) loading.dismiss();
      });
  }
  doRefresh(refresher: { complete: () => void }) {
    this.getInventorisRecordList(true, refresher);
  }

  doInfinite(infiniteScroll: { complete: () => void }) {
    this.page++;
    const params = {
      materialType: this.materialType,
      myOperate: this.searchParams.myOperate,
      ioSubTypes: this.searchParams.ioSubTypes || [],
      warehouseId: this.searchParams.warehouseId || null,
      materialIds:
        (this.searchParams.materia &&
          this.searchParams.materia.map((item) => item.materialId)) ||
        null,
      startTime:
        this.searchParams.startTime ||
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endTime: this.searchParams.endTime || moment().format('YYYY-MM-DD'),
      ioStatus: this.searchParams.ioStatus,
      operator:
        (this.searchParams.operator && this.searchParams.operator.userId) ||
        null,
      approver:
        (this.searchParams.approver && this.searchParams.approver.userId) ||
        null,
      page: this.page,
      size: 10,
    };

    this.materialservice
      .getInventorisRecordList({ ...params })
      .subscribe((res) => {
        if (res && res.content.length > 0) {
          this.inventorisRecordList = this.inventorisRecordList.concat(
            res['content']
          );
        } else {
          this.page--;
        }
        if (this.inventorisRecordList.length >= res['totalElements']) {
          this.canInfinite = false;
        }
        infiniteScroll.complete();
      });
  }

  // 打开右侧条件筛选
  openSearchBar() {
    let modal = this.modalCtrl.create(
      InventorisRecordSearchPage,
      {
        searchParams: this.searchParams,
        materialType: this.materialType,
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
          this.searchParams = {
            ...data.value,
          };
          this.getInventorisRecordList(true);
        }
      }
    });
    modal.present();
  }

  //inventorisMenus
  public inventorisMenus(myEvent) {
    this.popover = this.popoverCtrl.create(
      InventorisMenusPage,
      {
        showQrcode: false,
      },
      {
        cssClass: 'inventorisMenus',
        showBackdrop: true,
      }
    );
    this.popover.onDidDismiss((res) => {
      if (res) {
        if (res.type === 'out') {
          const user = JSON.parse(localStorage.getItem('USER_INFO'));
          this.navCtrl.push(InventorisOutInPage, {
            type: 'out',
            materialType: this.materialType,
            value: {
              warehouseId: this.warehouses ? this.warehouses.warehouseId : null,
              warehouseName: this.warehouses
                ? this.warehouses.warehouseName
                : null,
              ioOperator: user.userId,
              ioOperatorName: user.realName,
              ioTime: moment().format(),
              materialIostorgeDetails: this.materials
                ? [
                  {
                    materialId: this.materials
                      ? this.materials.materialId
                      : null,
                    materialNo: this.materials
                      ? this.materials.materialNo
                      : null,
                  },
                ]
                : [],
            },
          });
        } else if (res.type === 'in') {
          const user = JSON.parse(localStorage.getItem('USER_INFO'));
          this.navCtrl.push(InventorisOutInPage, {
            type: 'in',
            materialType: this.materialType,
            value: {
              warehouseId: this.warehouses ? this.warehouses.warehouseId : null,
              warehouseName: this.warehouses
                ? this.warehouses.warehouseName
                : null,
              ioOperator: user.userId,
              ioOperatorName: user.realName,
              ioTime: moment().format(),
              materialIostorgeDetails: this.materials
                ? [
                  {
                    materialId: this.materials
                      ? this.materials.materialId
                      : null,
                    materialNo: this.materials
                      ? this.materials.materialNo
                      : null,
                  },
                ]
                : [],
            },
          });
        }
      }
    });
    this.popover.present({
      ev: myEvent,
    });
  }

  materialsIostorage(iostorageId, approve = false) {
    this.navCtrl.push(InventorisOutInPage, {
      iostorageId,
      approve,
      materialType: this.materialType,
    });
  }


}
