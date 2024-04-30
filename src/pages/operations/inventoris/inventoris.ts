import { MutilService } from './../../../providers/util/Mutil.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { InventorisRecordPage } from './inventoris-record/inventoris-record';
import { MaterialService } from './../../../providers/material.service';
import { InventorisMenusPage } from './inventoris-menus/inventoris-menus';
import { Component, Inject } from '@angular/core';
import {
  NavController,
  NavParams,
  PopoverController,
  ModalController,
  LoadingController,
  ToastController,
  MenuController,
  ActionSheetController,
} from 'ionic-angular';
import { APP_CONFIG, AppConfig } from '../../../models/app-config';
import { InventorisOutInPage } from './inventoris-out-in/inventoris-out-in';
import { BarcodeScannerPage } from '../../barcode-scanner/barcode-scanner';
import { CommonWarehousePage } from '../../util/common-warehouse/common-warehouse';
import { CommonStationPage } from '../../util/common-station/common-station';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';

import { CommonInputPage } from '../../util/modal/common-input/common-input';

import moment from 'moment';
import { CommonMaterialsPage } from '../../util/common-materials/common-materials';
/**
 * Generated class for the InventorisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventoris',
  templateUrl: 'inventoris.html',
})
export class InventorisPage {
  page: number = 0;
  inventorisList: any;
  canInfinite: boolean = true;
  warehouseId: any;
  materialId: any;
  fileBasePath: string = '';
  warehouses: any = null;
  materials: any = null;
  materialNo: any = null;
  popover: any;
  freshPage: any;
  deviceId: any;
  equipment: any;
  station: any;
  showMenu: boolean = false;
  type: any;
  materialType: any;
  materialTypesButtons: any;
  materialTypeText: any = '物资';
  materia: any[] = [];
  materialIds: any;
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private materialservice: MaterialService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private menuCtrl: MenuController,
    private photoViewer: PhotoViewer,
    private mutilservice: MutilService,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.fileBasePath = appConfig.fileEndpoint;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventorisPage');
    if (this.navParams.get('stationId')) {
      this.station = {
        id: this.navParams.get('stationId'),
      };
    }
    this.equipment = this.navParams.get('equipment');
    this.materialType = this.navParams.get('materialType') || '01';
    this.getMaterialTypes();
    this.getInventorisList(true);
  }

  getMaterialTypes() {
    this.materialservice.getMaterialTypes().subscribe((res) => {
      this.materialTypesButtons = res.map((item) => ({
        text: item.second,
        handler: () => {
          this.materialType = item.first;
          this.materialTypeText = item.second;
          this.materia = [];
          this.materialIds = [];
          this.getInventorisList(true);
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

  ionViewWillEnter() {
    this.materialNo = this.navParams.get('qrResult');
    if (this.materialNo) {
      this.navParams.data.qrResult = null;
      this.materialservice
        .getMaterialByMaterialNo(this.materialNo)
        .subscribe((res) => {
          if (res) {
            this.materials = res;
            this.serchMenu();
          } else {
            const toast = this.toastCtrl.create({
              message: '该物料不存在',
              duration: 1000,
              position: 'middle',
            });
            toast.present();
          }
        });
    }
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.getInventorisList(true);
    }

    const equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      this.navParams.data.equipmentList = [];
      if (equipmentList.length > 0) {
        this.equipment = equipmentList[0];
      } else {
        this.equipment = null;
      }
    }
  }

  //inventorisMenus
  public inventorisMenus(myEvent) {
    this.popover = this.popoverCtrl.create(
      InventorisMenusPage,
      {
        materialType: this.materialType,
      },
      {
        cssClass: 'inventorisMenus',
        showBackdrop: true,
      }
    );
    this.popover.onDidDismiss((res) => {
      if (res) {
        if (res.type === 'qrcode') {
          this.navCtrl.push(BarcodeScannerPage);
        } else if (res.type === 'out') {
          const user = JSON.parse(localStorage.getItem('USER_INFO'));
          this.navCtrl.push(InventorisOutInPage, {
            materialType: res.materialType,
            type: 'out',
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
            materialType: res.materialType,
            type: 'in',
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

  getInventorisList(first, refresher?) {
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
      materialType: this.materialType,
      warehouseId: (this.warehouses && this.warehouses.warehouseId) || null,
      materialIds: this.materialIds || null,
      deviceId: (this.equipment && this.equipment.deviceId) || null,
      page: this.page,
      size: 10,
    };
    this.materialservice.getInventorisList({ ...params }).subscribe((res) => {
      if (res) {
        this.inventorisList = res.content;
      }
      if (refresher) refresher.complete();
      if (loading) loading.dismiss();
    });
  }

  doRefresh(refresher: { complete: () => void }) {
    this.getInventorisList(true, refresher);
  }

  doInfinite(infiniteScroll: { complete: () => void }) {
    this.page++;
    const params = {
      materialType: this.materialType,
      warehouseId: (this.warehouses && this.warehouses.warehouseId) || null,
      materialIds: this.materialIds || null,
      deviceId: (this.equipment && this.equipment.deviceId) || null,
      page: this.page,
      size: 10,
    };

    this.materialservice.getInventorisList({ ...params }).subscribe((res) => {
      if (res && res.content.length > 0) {
        this.inventorisList = this.inventorisList.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.inventorisList.length >= res['totalElements']) {
        this.canInfinite = false;
      }
      infiniteScroll.complete();
    });
  }

  public inventorisRecord(inventoris) {
    this.navCtrl.push(InventorisRecordPage, {
      myOperate: null,
      materialType: this.materialType,
      warehouseId: inventoris.warehouseId,
      warehouseName: inventoris.warehouseName,
      materialId: inventoris.materialId,
      materialNo: inventoris.materialNo,
    });
  }

  openInputModal(params, type) {
    const modal = this.modalCtrl.create(
      CommonInputPage,
      {
        title: type === 'in' ? '入库数量' : '出库数量',
        type: 'number',
      },
      {
        cssClass: 'commonModal commonInputModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data && data.value) {
        params.ioNum = data.value;
        this.inventorisOutIn(params, type);
      }
    });
    modal.present();
  }

  public inventorisOutIn(params, type) {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));
    this.navCtrl.push(InventorisOutInPage, {
      type: type,
      value: {
        warehouseId: params.warehouseId,
        warehouseName: params.warehouseName,
        ioOperator: user.userId,
        ioTime: moment().format(),
        ioOperatorName: user.realName,
        materialIostorgeDetails: [
          {
            inventoryId: params.inventoryId,
            materialId: params.materialId,
            materialNo: params.materialNo,
            materialSpec: params.materialSpec,
            materialName: params.materialName,
            ioNum: params.ioNum,
            unit: params.unit,
          },
        ],
      },
    });
  }

  /**控制侧边栏 */
  serchMenu() {
    this.showMenu = true;
    setTimeout(() => {
      this.menuCtrl.enable(true, 'search');
      this.menuCtrl.open('search');
    }, 0);
  }

  selectWarehouses() {
    let modal = this.modalCtrl.create(CommonWarehousePage, {
      selectedItem: [this.materials],
    });
    modal.onDidDismiss((e) => {
      if (e) {
        if (e.type === 'ok') {
          this.warehouses = e.value;
        } else {
          this.warehouses = null;
        }
      }
    });
    modal.present({ keyboardClose: true });
  }

  clearWarehouses(event) {
    event.stopPropagation();
    this.warehouses = null;
  }

  selectEquipment() {
    if (!this.equipment) {
      let modal = this.modalCtrl.create(CommonStationPage, {});
      modal.onDidDismiss((e) => {
        if (e) {
          this.station = e;
          this.navCtrl.push(EquipmentListPage, {
            stationId: e.id,
            isSingle: true,
            selectedItem: [],
          });
        }
      });
      modal.present({ keyboardClose: true });
    } else {
      this.navCtrl.push(EquipmentListPage, {
        stationId: this.station.id,
        isSingle: true,
        selectedItem: [this.equipment],
      });
    }
  }

  clearEquipment(event) {
    event.stopPropagation && event.stopPropagation();
    this.equipment = null;
  }

  ok() {
    this.menuCtrl.close('search');
    this.getInventorisList(true);
  }

  reset() {
    this.warehouses = null;
    this.materials = null;
    this.equipment = null;
  }

  viewImage(url) {
    this.photoViewer.show(url);
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
      selectedItem: this.materia || [],
    });
    modal.onDidDismiss((e) => {
      if (e) {
        if (e.type == 'ok') {
          this.materialIds = e.value.map((item) => item.materialId);
        } else {
          this.materia = [];
          this.materialIds = [];
        }
      }
    });
    modal.present({ keyboardClose: true });
  }
}
