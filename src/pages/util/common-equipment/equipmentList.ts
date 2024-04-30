import { Events } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { templateJitUrl } from '@angular/compiler';
import { NavParams, NavController, ViewController, ModalController } from 'ionic-angular';
import { MonitorService } from '../../../providers/monitor.service';
import { CacheService } from '../../../providers/util/cache.service';
import { EquipmentMessage } from '../../home/equipment-message/equipment.message';
import * as _ from 'lodash';
import { SelectedEquipmentListPage } from './selected-equipment-list/selected-equipment-list';
import { BarcodeScannerPage } from '../../barcode-scanner/barcode-scanner';

@Component({
  selector: 'equipment-list',
  templateUrl: 'equipmentList.html',
})
export class EquipmentListPage {
  equipmentTypes = [];
  equipmentAreas = [];
  equipmentList = [];
  stationId: string;
  param = {
    areaIds: '',
    classIds: '',
    deviceNoOrName: '',
  };
  pageIndex: number = 0;
  selectedItem: any = [];

  hiddenSelectedModal = true;
  modal: any;
  isSingle: any;
  deviceId: any;
  moreEquipmentAreas = false;
  moreEquipmentType = false;
  deviceNoOrName: any;
  editable: boolean;
  // 判断是否通过按钮关闭
  btnCloseFlag = false;
  deviceType: any;
  isTracking: any;
  switch = true;

  constructor(
    private navCtrl: NavController,
    public monitorService: MonitorService,
    public cacheService: CacheService,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private events: Events,
  ) {
    this.stationId = this.navParams.get('stationId');
    this.editable = this.navParams.get('editable') === false ? false : true;
    if (this.navParams.get('deviceId') && this.navParams.get('deviceName')) {
      this.selectedItem = [
        {
          deviceId: this.navParams.get('deviceId'),
          deviceName: this.navParams.get('deviceName'),
        },
      ];
    } else if (this.navParams.get('selectedItem')) {
      this.selectedItem = this.navParams.get('selectedItem');
    }
    this.deviceType = this.navParams.get('deviceType') || null;
    this.events.subscribe('item', (res) => {
      this.selectedItem = res;
      document.getElementById('count').innerText = res.length;
    });
  }

  /**设备区域查询条件 */
  getEquipmentAreas() {
    this.monitorService.getEquipmentArea(this.stationId).subscribe((e) => {
      if (e) {
        this.equipmentAreas = e;
      }
    });
  }
  /**电站类型查询条件 */
  getEquipmentTypes() {
    this.monitorService
      .getDeviceClasses({ stationId: this.stationId, deviceType: this.deviceType })
      .subscribe((e) => {
        if (e) {
          this.equipmentTypes = e;
        }
      });
  }

  timeout; //筛选标识
  /**电站列表查询 */
  getEquipmentList(refresher?) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.monitorService
        .getDevicesListUrl({
          stationId: this.stationId,
          deviceNoOrName: this.param.deviceNoOrName,
          classIds: this.param.classIds,
          areaIds: this.param.areaIds,
          page: this.pageIndex,
          deviceTypes: this.deviceType,
          size: 10,
        })
        .subscribe((e) => {
          if (e) {
            this.equipmentList = this.equipmentList.concat(e['content']);
            if (!e['content'].length || e['content'].length < 0) {
              this.noDoInfinite = true;
            } else {
              this.noDoInfinite = false;
            }
          }
          if (refresher) refresher.complete();
        });
    }, 1000 * 1.5);
  }
  ionViewDidLoad() {
    this.pageIndex = 0;
    this.param = this.cacheService.getDevicesSelect();
    this.getEquipmentList();
    this.getEquipmentAreas();
    this.getEquipmentTypes();
    this.isSingle = this.navParams.get('isSingle');
    this.isTracking = this.navParams.get('isTracking');
  }

  ionViewWillEnter() {
    this.deviceNoOrName = this.navParams.get('qrResult');
    if (this.deviceNoOrName) {
      this.navParams.data.qrResult = null;
      this.param = {
        areaIds: '',
        classIds: '',
        deviceNoOrName: this.deviceNoOrName,
      };
      this.equipmentList = [];
      this.getEquipmentList();
    }
  }

  ionViewWillLeave() {
    this.param.deviceNoOrName = '';
    this.cacheService.setEquipmentSelect(this.param);
    if (!this.btnCloseFlag) {
      this.navCtrl.getPrevious().data.equipmentList = null;
    }
    if (this.isTracking) {
      this.navCtrl.getPrevious().data.isTracking = true;
    }
  }

  /********************************筛选条件*************************************************************************/
  /**显示/隐藏赛选页 */
  location_switch = true;
  type_switch = true;

  getValue(value, number) {
    let arr = value.split(':');
    if (number == 0) return arr[number];
    if (number == 1 && arr.length == 2) return arr[number];
    else return '无';
  }
  select(type, id) {
    if (id === this.param[type]) {
      this.param[type] = '';
    } else {
      this.param[type] = id;
    }
    this.equipmentList = [];
    this.pageIndex = 0;
    this.getEquipmentList();
  }
  onCancel() {
    this.equipmentList = [];
    this.pageIndex = 0;
    this.getEquipmentList();
  }
  /********************************筛选条件*************************************************************************/

  noDoInfinite = false;
  doInfinite(refresher) {
    this.pageIndex++;
    this.getEquipmentList(refresher);
  }

  checkClick(equipment) {
    if (!this.editable) {
      return;
    }
    if (!this.isSingle) {
      let index = _.findIndex(this.selectedItem, (o) => o.deviceId == equipment.deviceId);
      if (index == -1) {
        this.selectedItem.push(equipment);
      } else {
        this.selectedItem.splice(index, 1);
      }
    } else {
      this.selectedItem = [equipment];
      this.commitEquipment();
    }
  }

  clearSelected() {
    this.selectedItem = [];
    this.commitEquipment();
  }

  showIcon(id) {
    let index = _.findIndex(this.selectedItem, (o) => o.deviceId == id);
    return index != -1;
  }

  toggleSelectedItemModal() {
    if (this.hiddenSelectedModal == true) {
      this.modal = this.modalCtrl.create(
        SelectedEquipmentListPage,
        {
          editable: this.editable,
          selectedItem: [...this.selectedItem],
        },
        {
          cssClass: 'selectedEquipmentList',
        },
      );
      this.modal.onDidDismiss((data) => {
        if (data === null) {
          this.hiddenSelectedModal = true;
        }
      });
      this.modal.present();
      this.hiddenSelectedModal = false;
    } else {
      this.modal.dismiss();
      this.hiddenSelectedModal = true;
    }
  }

  commitEquipment() {
    if (!this.hiddenSelectedModal) {
      this.modal.dismiss();
      this.hiddenSelectedModal = true;
    }
    this.btnCloseFlag = true;
    this.navCtrl.getPrevious().data.equipmentList = this.selectedItem;
    this.navCtrl.pop();
  }

  scan($event) {
    this.navCtrl.push(
      BarcodeScannerPage,
      {},
      {
        ev: $event,
        isNavRoot: true,
      },
    );
  }
}
