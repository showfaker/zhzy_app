import { MutilService } from './../../../providers/util/Mutil.service';
import { MaterialService } from './../../../providers/material.service';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import * as _ from 'lodash';
/**
 * Generated class for the CommonMaterialsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-materials',
  templateUrl: 'common-materials.html',
})
export class CommonMaterialsPage {
  materialList: any = [];
  selectedItem: any = [];
  hiddenSelectedModal: boolean = true;
  ioType: any;
  warehouseId: any;
  ioNum: string;
  materialType: any;
  selectType: any = 'single';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private materialservice: MaterialService,
    private mutilservice: MutilService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonMaterialsPage');
    this.ioType = this.navParams.get('ioType');
    this.materialType = this.navParams.get('materialType');
    this.warehouseId = this.navParams.get('warehouseId') || null;
    this.selectedItem = this.navParams.get('selectedItem') || [];
    this.selectType = this.navParams.get('selectType') || 'single';
    if (this.selectType === 'single') {
      if (!_.isEmpty(this.selectedItem)) {
        this.ioNum = this.selectedItem[0].ioNum;
      }
    }

    this.query();
  }

  close() {
    this.viewCtrl.dismiss(null);
  }

  query(name = null) {
    this.materialservice
      .getMaterialList({
        name,
        ioType: this.ioType,
        materialType: this.materialType,
        warehouseId: this.warehouseId,
      })
      .subscribe((res) => {
        if (res) {
          this.materialList = res;
        }
      });
  }

  searchMaterials(event) {
    this.query(event.target.value);
  }

  commitMaterials() {
    if (_.isEmpty(this.selectedItem)) {
      return this.mutilservice.popToastView(`请先选择库存物料`);
    }

    if (isNaN(Number(this.ioNum))) {
      return this.mutilservice.popToastView(
        `请输入正确的${this.ioType === '01' ? '出库数量' : '入库数量'}`
      );
    }
    if (!/^\+?[1-9]\d*$/.test(this.ioNum)) {
      return this.mutilservice.popToastView(
        `${this.ioType === '01' ? '出库数量' : '入库数量'}必须大于0的正整数`
      );
    }
    this.viewCtrl.dismiss({
      value: {
        ...this.selectedItem[0],
        ioNum: +this.ioNum,
      },
      type: 'ok',
    });
  }
  /**
   * 点击物料
   */
  public selectMaterial(material) {
    if (this.selectType === 'single') {
      this.selectedItem = [material];
    } else {
      let index = _.findIndex(
        this.selectedItem,
        (o) => o.materialId == material.materialId
      );
      if (index == -1) {
        this.selectedItem.push(material);
      } else {
        this.selectedItem.splice(index, 1);
      }
    }
  }

  clearAll() {
    this.selectedItem = [];
    this.viewCtrl.dismiss({ value: null, type: 'clear' });
  }

  ok() {
    console.log(this.selectedItem);
    this.viewCtrl.dismiss({
      value: [...this.selectedItem],
      type: 'ok',
    });
  }

  showIcon(materialId) {
    let index = _.findIndex(
      this.selectedItem,
      (o) => o.materialId == materialId
    );
    return index != -1;
  }
}
