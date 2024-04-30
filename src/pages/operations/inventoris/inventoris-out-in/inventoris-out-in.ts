import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  NavController,
  NavParams,
} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BackendService } from '../../../../providers/backend.service';
import { MaterialService } from '../../../../providers/material.service';
import { MutilService } from '../../../../providers/util/Mutil.service';
import { CommonMaterialsPage } from '../../../util/common-materials/common-materials';
import { CommonUserPage } from '../../../util/common-user/common-user';
import { CommonWarehousePage } from '../../../util/common-warehouse/common-warehouse';
import { CommonDefectCodePage } from '../../../util/modal/common-defect-code/common-defect-code';
import { CommonTextareaPage } from '../../../util/modal/common-textarea/common-textarea';

/**
 * Generated class for the InventorisOutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventoris-out-in',
  templateUrl: 'inventoris-out-in.html',
})
export class InventorisOutInPage {
  form: FormGroup;
  ioSubTypeOptions: any = [];
  customIoTimePickerOptions = {
    buttons: [
      {
        text: '清除',
        handler: () => this.form.patchValue({ ioTime: null }),
      },
    ],
    cssClass: 'hiddenCancelButton',
  };
  type: any;
  view: boolean = false;
  approve: boolean = false;
  relaBusinessTypeText: any = '单号';
  from: any;
  iostorageId: any;

  toggleBaseInfo = true;
  materialDetailsToggle = true;
  showRelaWarehouse: boolean = false;
  materialType: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private backendservice: BackendService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private mutilservice: MutilService,
    private alertCtrl: AlertController,
    private materialservice: MaterialService
  ) {
    this.form = this.fb.group({
      ioSubType: new FormControl(null, Validators.required),
      ioSubTypeText: new FormControl(null),
      warehouseId: new FormControl(null, Validators.required),
      warehouseName: new FormControl(null),
      ioOperator: new FormControl(null, Validators.required),
      ioOperatorName: new FormControl(null),
      ioTime: new FormControl(null, Validators.required),
      planTime: new FormControl(null),
      relaWarehouseId: new FormControl(null),
      relaWarehouseName: new FormControl(null),
      relaBusinessType: new FormControl('01'),
      relaBusinessId: new FormControl(null),
      relaBusinessCode: new FormControl(null),
      approverName: new FormControl(null),
      approveTime: new FormControl(null),
      checkerName: new FormControl(null),
      ioDesc: new FormControl(null),
      checkTime: new FormControl(null),
      materialIostorgeDetails: this.fb.array([]),
    });
  }

  getMaterialIostorgeDetails(form) {
    return form.controls.materialIostorgeDetails.controls;
  }

  // 初始物资明细
  initMaterialIostorgeDetails() {
    return new FormGroup({
      inventoryId: new FormControl(null),
      materialId: new FormControl(null, Validators.required),
      materialNo: new FormControl(null),
      materialName: new FormControl(null),
      materialSpec: new FormControl(null),
      unit: new FormControl(null),
      unitText: new FormControl(null),
      inventoryNum: new FormControl(null),
      ioNum: new FormControl(null, Validators.required),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventorisOutPage');

    this.view = this.navParams.get('view');
    this.approve = this.navParams.get('approve');
    if (this.approve) {
      this.view = true;
    }
    this.iostorageId = this.navParams.get('iostorageId');

    this.type = this.navParams.get('type');
    this.materialType = this.navParams.get('materialType') || '01';

    this.materialservice
      .getmaterialsIoSubTypes(
        this.type === 'out' ? '01' : '02',
        this.materialType
      )
      .subscribe((res) => {
        this.ioSubTypeOptions = res;
      });

    if (this.iostorageId) {
      this.materialservice
        .getMaterialsIostorage(this.iostorageId)
        .subscribe((res) => {
          this.type = res.ioType == '01' ? 'out' : 'in';
          this.relaBusinessTypeText = res.relaBusinessTypeText;
          this.showRelaWarehouse = res.relaWarehouseId ? true : false;
          this.fillForm(res);
        });
      this.view = true;
      return;
    }

    this.relaBusinessTypeText =
      this.navParams.get('relaBusinessTypeText') || '单号';
    const value = this.navParams.get('value');
    console.log(value);

    this.fillForm(value);
  }

  fillForm(data) {
    data.ioTime = moment(data.ioTime).format();
    data.approveTime = _.isNumber(data.approveTime)
      ? moment(data.approveTime).format()
      : null;
    data.checkTime = _.isNumber(data.checkTime)
      ? moment(data.checkTime).format()
      : null;

    if (data.materialIostorgeDetails !== null) {
      let control = this.form.get('materialIostorgeDetails') as FormArray;
      while (control.length) {
        control.removeAt(control.length - 1);
      }
      data.materialIostorgeDetails.map((item) => {
        control.push(this.initMaterialIostorgeDetails());
      });
    } else {
      data.repairTickets = [];
    }

    this.form.patchValue({ ...data });
  }

  /**
   * name
   */
  public buildIoSubTypeOption(options) {
    const buttons = this.ioSubTypeOptions.map((item) => {
      return {
        text: item.second,
        handler: () => {
          this.showRelaWarehouse = item.param3 ? true : false;
          this.form.patchValue({
            ioSubType: item.first,
            ioSubTypeText: item.second,
          });
        },
      };
    });
    const actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: buttons,
      cssClass: 'commonSheet',
    });
    actionSheet.present();
  }

  // 仓库选择
  selectWarehouses({ id, name }, allWarehouses = true) {
    const value = this.form.value;
    let modal = this.modalCtrl.create(CommonWarehousePage, {
      allWarehouses,
      selectedItem: [
        {
          warehouseId: value[id],
          warehouseName: value[name],
        },
      ],
    });
    modal.onDidDismiss((e) => {
      if (e) {
        if (e.type === 'ok') {
          this.form.patchValue({
            [id]: e.value.warehouseId,
            [name]: e.value.warehouseName,
          });
        } else {
          this.form.patchValue({
            [id]: null,
            [name]: null,
          });
        }
      }
    });
    modal.present({ keyboardClose: true });
  }

  //物料选择
  selectMaterials(type, materia?, index?) {
    if (this.view) {
      return;
    }
    const value = this.form.value;
    const ioType = this.type === 'out' ? '01' : '02';
    if (ioType === '01' && !value.warehouseId) {
      return this.mutilservice.popToastView('请先选择仓库');
    }
    let modal = this.modalCtrl.create(CommonMaterialsPage, {
      ioType: ioType,
      materialType: this.materialType,
      warehouseId: value.warehouseId || null,
      selectedItem:
        type === 'add'
          ? []
          : [
              {
                ...materia.value,
              },
            ],
    });
    modal.onDidDismiss((e) => {
      if (e) {
        if (e.type == 'ok') {
          if (type === 'add') {
            const materialIostorgeDetails =
              this.form.value.materialIostorgeDetails;
            const control = this.form.get(
              'materialIostorgeDetails'
            ) as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            materialIostorgeDetails.push({
              ...e.value,
            });
            materialIostorgeDetails.map((item) => {
              control.push(this.initMaterialIostorgeDetails());
            });
            this.form
              .get('materialIostorgeDetails')
              .patchValue(materialIostorgeDetails);
          } else {
            const control = this.form.get(
              'materialIostorgeDetails'
            ) as FormArray;
            control.controls[index].setValue({
              ...e.value,
            });
          }
        }
      }
    });
    modal.present({ keyboardClose: true });
  }

  deleteMaterialIostorgeDetails(index) {
    const control = this.form.get('materialIostorgeDetails') as FormArray;
    control.removeAt(index);
  }

  selectUser() {
    const value = this.form.value;
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: true,
      selectedItem: [
        { userId: value.ioOperator, userName: value.ioOperatorName },
      ],
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.form.patchValue({
            ioOperator: data.value[0] ? data.value[0].userId : null,
            ioOperatorName: data.value[0] ? data.value[0].realName : null,
          });
        } else {
          this.form.patchValue({
            ioOperator: null,
            ioOperatorName: null,
          });
        }
      }
    });
    modal.present();
  }

  selectBusiness() {
    const modal = this.modalCtrl.create(
      CommonDefectCodePage,
      {
        value: {
          relaBusinessCode: this.form.value.relaBusinessCode,
          relaBusinessId: this.form.value.relaBusinessId,
        },
        title: this.relaBusinessTypeText,
        type: 'text',
      },
      {
        cssClass: 'commonModal commonDefectCodeModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          this.form.patchValue({
            relaBusinessCode: data.value.relaBusinessCode,
            relaBusinessId: data.value.relaBusinessId,
          });
        } else {
          this.form.patchValue({
            relaBusinessCode: null,
            relaBusinessId: null,
          });
        }
      }
    });
    modal.present();
  }

  addMemo() {
    const modal = this.modalCtrl.create(
      CommonTextareaPage,
      {
        title: this.type === 'in' ? '入库说明' : '出库说明',
        value: this.form.value.ioDesc,
      },
      {
        cssClass: 'commonModal commonTextareaModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.form.patchValue({ ioDesc: data.value });
        } else if (data.type == 'clear') {
          this.form.patchValue({ ioDesc: null });
        }
      }
    });
    modal.present();
  }

  cancel() {
    console.log(this.navCtrl.getPrevious());
    this.navCtrl.pop();
  }

  save() {
    if (this.showRelaWarehouse && !this.form.value.relaWarehouseId) {
      return this.mutilservice.popToastView('对方仓库不能为空');
    }
    if (!this.mutilservice.isValid(this.form)) {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请检查必填项',
        buttons: ['关闭'],
      });
      alert.present();
    } else {
      const value = this.form.value;
      if (value.ioTime.indexOf('Z') != -1) {
        value.ioTime = moment(
          value.ioTime.substr(0, value.ioTime.length - 1)
        ).format();
      }
      value.planTime = value.ioTime;
      const params = {
        ...value,
      };

      if (this.type === 'out') {
        this.materialservice.saveMaterialsOut(params).subscribe((res) => {
          this.mutilservice.popToastView('出库成功');
          this.navCtrl.getPrevious().data.freshPage = true;
          this.navCtrl.pop();
        });
      } else {
        this.materialservice.saveMaterialsIn(params).subscribe((res) => {
          this.mutilservice.popToastView('入库成功');
          this.navCtrl.getPrevious().data.freshPage = true;
          this.navCtrl.pop();
        });
      }
    }
  }

  materialsApprove(type) {
    const params = {
      iostorageId: this.iostorageId,
      ioStatus: type,
    };
    this.materialservice.materialsApprove(params).subscribe((res) => {
      this.mutilservice.popToastView('提交成功');
      this.navCtrl.getPrevious().data.freshPage = true;
      this.navCtrl.pop();
    });
  }
}
