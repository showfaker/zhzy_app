import { Component } from '@angular/core';
import { templateJitUrl } from '@angular/compiler';
import { NavParams, NavController, ViewController } from 'ionic-angular';
import { MonitorService } from '../../../providers/monitor.service';
import { CacheService } from '../../../providers/util/cache.service';
import { EquipmentMessage } from '../../home/equipment-message/equipment.message';
import { BarcodeScannerPage } from '../../barcode-scanner/barcode-scanner';

@Component({
  selector: 'station-equipment-list',
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
  moreEquipmentAreas = false;
  moreEquipmentType = false;
  deviceNoOrName: any;
  constructor(
    private navCtrl: NavController,
    public monitorService: MonitorService,
    public cacheService: CacheService,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.stationId = this.navParams.get('stationId');
  }

  /**设备区域查询条件 */
  getEquipmentAreas() {
    this.monitorService.getEquipmentArea(this.stationId).subscribe((e) => {
      if (e) {
        this.equipmentAreas = e;
        console.log(e);
      }
    });
  }
  /**电站类型查询条件 */
  getEquipmentTypes() {
    this.monitorService.getDeviceClasses({ stationId: this.stationId }).subscribe((e) => {
      if (e) {
        this.equipmentTypes = e;
        console.log(e);
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
          size: 10,
        })
        .subscribe((e) => {
          if (e) {
            console.log(e);
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
    this.cacheService.setEquipmentSelect(this.param);
  }

  /********************************筛选条件*************************************************************************/
  /**显示/隐藏赛选页 */
  location_switch = true;
  type_switch = true;
  switch = true;

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

  close() {
    this.viewCtrl.dismiss();
  }

  checkClick(equipment) {
    this.navCtrl.push(EquipmentMessage, { deviceId: equipment.deviceId });
  }

  scan() {
    this.navCtrl.push(BarcodeScannerPage);
  }
}
