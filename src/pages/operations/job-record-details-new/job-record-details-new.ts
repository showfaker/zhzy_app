import { MutilService } from '../../../providers/util/Mutil.service';
import { JobRecordLossesPage } from '../../util/modal/job-record-losses/job-record-losses';
import {
  ActionSheetController,
  AlertController,
  ToastController,
  LoadingController,
} from 'ionic-angular';
import { RunLogService } from '../../../providers/runlog.service';
import { CommonInputPage } from '../../util/modal/common-input/common-input';
import { ViewController, ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  FormArray,
} from '@angular/forms';
import * as _ from 'lodash';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonTextareaPage } from '../../util/modal/common-textarea/common-textarea';
import * as moment from 'moment';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';
declare const currency: any;
/**
 * Generated class for the JobRecordDetailsNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-job-record-details-new',
  templateUrl: 'job-record-details-new.html',
})
export class JobRecordDetailsNewPage {
  stationId: any;

  recordId: any;
  title: any;
  buttons: any;
  form: FormGroup;
  reportDate: any;
  fields: any = {};
  stationType: any;
  weatherOptions: any;
  enegiesType: any;
  enegiesTypeIndex: number;
  editType: string;
  lossTypeOptions: any;
  selectOptions: any = {};

  // 电站信息
  toggleBaseInfo = true;
  // 出口发电量
  toggleEnegies01 = false;
  // 出口发电量
  toggleEnegies02 = false;
  // 出口发电量
  toggleEnegies03 = false;
  // 出口发电量
  toggleEnegies04 = false;
  // 出口发电量
  togglePowerGeneration = false;
  // 天气情况
  toggleWeatherInfo = false;
  // 损失电量
  toggleJobRecordLosses = false;
  // 发电预测
  togglePowerForecast = false;
  // 损耗情况
  toggleDailyLoss = false;
  // 损耗情况
  toggleMemo = false;
  equipmentFormParams: {
    type: any;
    typeText: any;
    form: any;
    index: any;
    formControl: any;
  };

  max = moment().format('YYYY-MM-DD');
  isFirstLoad: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formbuilder: FormBuilder,
    private modalCtrl: ModalController,
    private runlogservice: RunLogService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private mutilservice: MutilService
  ) {
    this.initForm();
    this.dropdownInit();
  }

  public dropdownInit() {
    Promise.all([
      this.runlogservice.getNemsProp('weatherInfo'),
      this.runlogservice.getNemsProp('lossType'),
    ]).then((data: any) => {
      this.selectOptions['weatherInfo'] = data[0].map((item) => {
        return {
          first: item.propValue,
          second: item.propName,
        };
      });
      this.form.patchValue({
        weatherInfo: data[0].propValue,
      });
      this.selectOptions['lossType'] = data[1].map((item) => {
        return {
          first: item.propValue,
          second: item.propName,
        };
      });
    });
  }

  initForm() {
    this.form = this.formbuilder.group({
      recordId: new FormControl(''),
      stationId: new FormControl('', [Validators.required]),
      stationName: new FormControl(''),
      parallelCapacity: new FormControl('', [Validators.required]),
      operationDate: new FormControl(),
      reportDate: new FormControl('', [Validators.required]),
      recorderName: new FormControl({ value: '' }),
      dailyEnergy: new FormControl(''),
      enegies: this.formbuilder.group({
        '01': this.formbuilder.array([]),
        '02': this.formbuilder.array([]),
        '03': this.formbuilder.array([]),
        '04': this.formbuilder.array([]),
      }),
      deviceEnergy: new FormControl('', [
        // Validators.required,
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      maxPower: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      maxPowerTime: new FormControl(''),
      maxTemp: new FormControl('', [Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]),
      minTemp: new FormControl('', [Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]),
      avgTemp: new FormControl('', [Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]),
      maxWindSpeed: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      minWindSpeed: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      windSpeed: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      weatherInfo: new FormControl(''),
      weatherInfoText: new FormControl(''),
      inverterStart: new FormControl(''),
      inverterStop: new FormControl(''),
      irradiation: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      inverterHours: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      kwhkwp: new FormControl('', [Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]),
      loss: this.formbuilder.array([]),
      forecastHours: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      forecastEnergy: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      forecastEnergy2: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      forecastWindSpeed: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      forecastPower: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      dailyLoss: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      svgLoss: new FormControl('', [Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]),
      transformerLoss: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      usageEnergy: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      usageEnergyRate: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      stopHours: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      usageRate: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
      memo: new FormControl('', [Validators.maxLength(500)]),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobRecordDetailsPage');
    this.stationId = this.navParams.get('stationId');
    this.recordId = this.navParams.get('recordId')
      ? this.navParams.get('recordId')
      : 0;
    const loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });

    loading.present();
    this.runlogservice
      .getRecord(this.recordId, this.stationId)
      .subscribe((res) => {
        loading.dismiss();
        if (res) {
          this.title = res.title;
          this.buttons = res.buttons;
          this.reportDate = moment(res.jobRecord.reportDate).format(
            'YYYY-MM-DD'
          );
          if (res.jobRecord.stationId) {
            this.stationId = res.jobRecord.stationId;
          }
          this.initData();
        }
      });
  }

  ionViewWillEnter() {
    const equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      this.navParams.data.equipmentList = [];

      let { type, typeText, form, index, formControl } =
        this.equipmentFormParams;

      if (equipmentList.length === 1) {
        if (!form) {
          this.form.patchValue({
            [type]: equipmentList[0].deviceId,
            [typeText]: equipmentList[0].deviceName,
          });
        } else {
          if (formControl) {
            const array = (this.form.controls[form] as FormGroup).controls[
              formControl
            ] as FormArray;

            array.at(index).patchValue({
              [type]: equipmentList[0].deviceId,
              [typeText]: equipmentList[0].deviceName,
            });
          } else {
            const array = this.form.controls[form] as FormArray;
            array.at(index).patchValue({
              [type]: equipmentList[0].deviceId,
              [typeText]: equipmentList[0].deviceName,
            });
          }
        }
      } else if (equipmentList.length === 0) {
        if (!form) {
          this.form.patchValue({
            [type]: '',
            [typeText]: '',
          });
        } else {
          if (formControl) {
            const array = (this.form.controls[form] as FormGroup).controls[
              formControl
            ] as FormArray;

            array.at(index).patchValue({
              [type]: '',
              [typeText]: '',
            });
          } else {
            const array = this.form.controls[form] as FormArray;
            array.at(index).patchValue({
              [type]: '',
              [typeText]: '',
            });
          }
        }
      }
    }
  }

  initData(flag?, event?) {
    let params = { stationId: this.stationId, reportDate: this.reportDate };

    if (flag) {
      const value = this.form.value;

      if (value.reportDate) {
        value.reportDate = moment(value.reportDate).format('YYYY-MM-DD');
      }

      params = {
        ...params,
        ...{
          stationId: value.stationId,
          reportDate: value.reportDate,
        },
      };
      this.stationId = value.stationId;
    }

    this.runlogservice.jobRecordsInit(params).then((res: any) => {
      res.fields.map((item) => {
        this.fields[item.code] = { show: item.show, label: item.name };
      });
      this.stationType = res.stationType;

      const value = this.form.value;
      if (value.enegies) {
        const object = value.enegies;
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            const element = object[key];
            const control = (this.form.get('enegies') as any).controls[
              key
            ] as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
          }
        }
      }

      if (value.loss) {
        const control = this.form.get('loss') as FormArray;
        while (control.length) {
          control.removeAt(control.length - 1);
        }
      }

      this.form.reset();

      this.form.patchValue({
        stationId: res.stationId,
        stationName: res.stationName,
        parallelCapacity: res.parallelCapacity,
        operationDate: res.operationDate
          ? moment(res.operationDate).format('YYYY-MM-DD')
          : null,
        reportDate: res.reportDate
          ? moment(res.reportDate).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        recorderName: res.recorderName,
        weatherInfo: this.selectOptions['weatherInfo'][0].first,
        weatherInfoText: this.selectOptions['weatherInfo'][0].second,
      });

      if (this.recordId && !flag) {
        this.runlogservice.getJobRecords(this.recordId).then((res: any) => {
          if (res.reportDate) {
            res.reportDate = moment(res.reportDate).format('YYYY-MM-DD');
          }
          if (res.inverterStart) {
            res.inverterStart = moment(res.inverterStart).format('HH:mm');
          }
          if (res.inverterStop) {
            res.inverterStop = moment(res.inverterStop).format('HH:mm');
          }
          if (res.operationDate) {
            res.operationDate = moment(res.operationDate).format('YYYY-MM-DD');
          }
          if (res.maxPowerTime) {
            res.maxPowerTime = moment(res.maxPowerTime).format('HH:mm');
          }
          if (res.enegies) {
            const object = res.enegies;
            for (const key in object) {
              if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                const control = (this.form.get('enegies') as any).controls[
                  key
                ] as FormArray;
                if (!control) {
                  break;
                }
                while (control.length) {
                  control.removeAt(control.length - 1);
                }
                element.map((item, index) => {
                  control.push(this['initEnegies' + key]());
                });
                if (key === '02') {
                  this.calculateKwhkwpValue('enegies', '02');
                }
              }
            }
            this.form.patchValue({ enegies: res.enegies });
          }
          if (res.loss) {
            const control = this.form.get('loss') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            res.loss.map((item, index) => {
              if (item.startTime) {
                item.startTime = moment(item.startTime).format('HH:mm');
              }
              if (item.endTime) {
                item.endTime = moment(item.endTime).format('HH:mm');
              }
              this.addJobRecordLosses();
            });
            this.form.patchValue({ loss: res.loss });
          }

          this.form.patchValue({
            ...res,
            maxPower: res.maxPower ? res.maxPower.toFixed(2) : 0,
          });

          this.calculateKwhkwpValue('enegies', '02');
        });
      } else if (!this.recordId) {
        if (res.enegies) {
          const object = res.enegies;
          for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
              const element = object[key];
              const control = (this.form.get('enegies') as any).controls[
                key
              ] as FormArray;
              if (!control) {
                break;
              }
              while (control.length) {
                control.removeAt(control.length - 1);
              }
              element.map((item, index) => {
                control.push(this['initEnegies' + key]());
              });
              if (key === '02') {
                this.calculateKwhkwpValue('enegies', '02');
              }
            }
          }
          this.form.patchValue({ enegies: res.enegies });
        }
      }
    });
  }

  handleDateTimeBlur(event) {
    this.reportDate = moment({
      ...event.value,
      month: event.value.month - 1,
    }).format('YYYY-MM-DD');

    this.initData(true);
  }

  // 按钮方法
  buttonFunction(type) {
    if (type === 'save') {
      this.saveData();
    } else if (type === 'delete') {
      this.deleteFunction();
    }
  }

  deleteFunction() {
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '确定要删除该条日报吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('取消');
          },
        },
        {
          text: '确定',
          handler: () => {
            this.runlogservice.deleteRecord(this.recordId).subscribe((res) => {
              let toast = this.toastCtrl.create({
                message: '删除成功!',
                duration: 500,
                position: 'middle',
              });
              toast.onDidDismiss(() => {
                this.navCtrl.pop();
              });
              toast.present();
            });
          },
        },
      ],
    });
    alert.present();
  }

  public formatSpinner(event, fixedNumber?) {
    let value = +event.target.value.replaceAll(',', '');
    // this.form.patchValue({
    //   parallelCapacity: fixedNumber ? value.toFixed(fixedNumber) : value.toFixed(0),
    // }
    event.target.value = fixedNumber
      ? value.toFixed(fixedNumber)
      : value.toFixed(0);
  }

  public getFormItem(form, type) {
    return (this.form.get(form) as any).controls[type].controls;
  }

  public addEnegies(form, type) {
    const array = (this.form.controls[form] as any).controls[type] as FormArray;
    array.push(this['initEnegies' + type]());
  }

  initEnegies01() {
    return this.formbuilder.group({
      energyNo: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      deviceId: new FormControl(''),
      deviceName: new FormControl(''),
      meterRatio: new FormControl(''),
      preValue: new FormControl(''),
      meterValue: new FormControl(''),
      dailyEnergy: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
    });
  }
  initEnegies02() {
    return this.formbuilder.group({
      deviceId: new FormControl(''),
      deviceName: new FormControl(''),
      meterRatio: new FormControl(''),
      preValue: new FormControl(''),
      meterValue: new FormControl(''),
      dailyEnergy: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
    });
  }
  initEnegies03() {
    return this.formbuilder.group({
      deviceId: new FormControl(''),
      deviceName: new FormControl(''),
      meterRatio: new FormControl(''),
      preValue: new FormControl(''),
      meterValue: new FormControl(''),
      dailyEnergy: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
    });
  }
  initEnegies04() {
    return this.formbuilder.group({
      deviceName: new FormControl('', [Validators.maxLength(30)]),
      dailyEnergy: new FormControl('', [
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
    });
  }

  removeItem(form, type, index) {
    const array = (this.form.controls[form] as any).controls[type] as FormArray;
    array.removeAt(index);
    if (type === '02') {
      this.calculateKwhkwpValue(form, type);
    } else if (type === '04') {
      this.calculateDeviceEnergyValue(form, type);
    } else if (type === '03') {
      this.calculateNegativeDailyEnergyValue(form, type);
    }
  }

  getObjectSelected(event) {
    if (this.enegiesType) {
      const array = (this.form.controls['enegies'] as any).controls[
        this.enegiesType
      ] as FormArray;
      array.at(this.enegiesTypeIndex).patchValue({
        deviceId: event.deviceId,
        deviceName: event.deviceName,
      });
    } else {
      const array = this.form.controls['loss'] as FormArray;
      array.at(this.enegiesTypeIndex).patchValue({
        deviceId: event.deviceId,
        deviceName: event.deviceName,
      });
    }
  }

  calculateDailyEnergyValue(form, type, index) {
    const array = (this.form.controls[form] as any).controls[type] as FormArray;
    const value: any = array.value[index];

    if (
      (value.meterValue || value.meterValue === 0) &&
      (value.preValue || value.preValue === 0) &&
      value.meterValue < value.preValue
    ) {
      this.mutilservice.popToastView('今日读数需要大于昨日读数');
      array.at(index).patchValue({ meterValue: null });
      return;
    }

    if (
      (value.meterValue || value.meterValue === 0) &&
      (value.preValue || value.preValue === 0) &&
      (value.meterRatio || value.meterRatio === 0)
    ) {
      const dailyEnergy: any = currency(value.meterValue)
        .subtract(value.preValue)
        .multiply(value.meterRatio).value;
      array.at(index).patchValue({ dailyEnergy });
      if (type === '02') {
        this.calculateKwhkwpValue(form, type);
      }
      if (type === '03') {
        this.calculateNegativeDailyEnergyValue(form, type);
      }
    }
  }

  calculateKwhkwpValue(form, type) {
    const array = (this.form.controls[form] as any).controls[type] as FormArray;
    const dailyEnergy = array.value.reduce(function (prev, curr, idx, arr) {
      return prev + curr.dailyEnergy;
    }, 0);

    this.form.patchValue({ dailyEnergy });
    if (this.form.value.parallelCapacity) {
      const kwhkwp = dailyEnergy / (this.form.value.parallelCapacity * 1000.0);
      this.form.patchValue({ kwhkwp: kwhkwp.toFixed(2) });
    }
    if (this.form.value.deviceEnergy || this.form.value.deviceEnergy === 0) {
      this.calculateDailyLossValue(+dailyEnergy, +this.form.value.deviceEnergy);
    }
  }

  calculateNegativeDailyEnergyValue(form, type) {
    const array = (this.form.controls[form] as any).controls[type] as FormArray;
    const dailyEnergy = array.value.reduce(function (prev, curr, idx, arr) {
      return prev + curr.dailyEnergy;
    }, 0);

    if (this.form.value.dailyLoss || this.form.value.dailyLoss === 0) {
      this.calculateUsageEnergyValue(+dailyEnergy, +this.form.value.dailyLoss);
    }
  }

  calculateDeviceEnergyValue(form, type) {
    const array = (this.form.controls[form] as any).controls[type] as FormArray;
    const deviceEnergy = array.value.reduce(function (prev, curr, idx, arr) {
      return prev + curr.dailyEnergy;
    }, 0);
    this.form.patchValue({
      deviceEnergy: deviceEnergy ? deviceEnergy.toFixed(2) : 0,
    });
    const value = this.form.value;
    if (value.dailyEnergy || value.dailyEnergy === 0) {
      this.calculateDailyLossValue(+value.dailyEnergy, +deviceEnergy);
    }
    if (this.form.value.usageEnergy || this.form.value.usageEnergy === 0) {
      this.calculateUsageEnergyRateValue(
        +this.form.value.usageEnergy,
        +this.form.value.deviceEnergy
      );
    }
  }

  deviceEnergyValueChange() {
    const value = this.form.value;
    if (
      (value.dailyEnergy || value.dailyEnergy === 0) &&
      (value.deviceEnergy || value.deviceEnergy === 0)
    ) {
      this.calculateDailyLossValue(+value.dailyEnergy, +value.deviceEnergy);
    }
    if (this.form.value.usageEnergy || this.form.value.usageEnergy === 0) {
      this.calculateUsageEnergyRateValue(
        +this.form.value.usageEnergy,
        +this.form.value.deviceEnergy
      );
    }
  }

  // 计算逆变器到上网关口表损耗
  calculateDailyLossValue(dailyEnergy, deviceEnergy) {
    // const dailyLoss = (dailyEnergy - deviceEnergy ).toFixed(2);
    const dailyLoss = (deviceEnergy - dailyEnergy).toFixed(2);
    this.form.patchValue({
      dailyLoss,
    });
    const array = (this.form.controls['enegies'] as any).controls[
      '03'
    ] as FormArray;
    const negativeDailyEnergy = array.value.reduce(function (
      prev,
      curr,
      idx,
      arr
    ) {
      return prev + curr.dailyEnergy;
    },
    0);

    if (negativeDailyEnergy || negativeDailyEnergy === 0) {
      this.calculateUsageEnergyValue(+negativeDailyEnergy, +dailyLoss);
    }
  }

  dailyLossChange() {
    // this.form.value.dailyLoss

    const dailyLoss = this.form.value.dailyLoss;

    if (!(dailyLoss || dailyLoss === 0)) {
      return;
    }
    const array = (this.form.controls['enegies'] as any).controls[
      '03'
    ] as FormArray;
    const negativeDailyEnergy = array.value.reduce(function (
      prev,
      curr,
      idx,
      arr
    ) {
      return prev + curr.dailyEnergy;
    },
    0);

    if (negativeDailyEnergy || negativeDailyEnergy === 0) {
      this.calculateUsageEnergyValue(+negativeDailyEnergy, +dailyLoss);
    }
  }

  // 计算 综合厂用电量
  calculateUsageEnergyValue(dailyEnergy, dailyLoss) {
    const usageEnergy = (dailyEnergy + dailyLoss).toFixed(2);
    this.form.patchValue({
      usageEnergy,
    });
    if (this.form.value.deviceEnergy) {
      this.calculateUsageEnergyRateValue(
        +usageEnergy,
        +this.form.value.deviceEnergy
      );
    }
  }

  usageEnergyChange() {
    const usageEnergy = this.form.value.usageEnergy;

    if (!(usageEnergy || usageEnergy === 0)) {
      return;
    }

    if (this.form.value.deviceEnergy) {
      this.calculateUsageEnergyRateValue(
        +usageEnergy,
        +this.form.value.deviceEnergy
      );
    }
  }

  // 计算综合厂用电率-%
  calculateUsageEnergyRateValue(usageEnergy, deviceEnergy) {
    if (deviceEnergy === 0 || !deviceEnergy) {
      this.form.patchValue({ usageEnergyRate: null });
      return;
    }
    const usageEnergyRate = (+(usageEnergy / deviceEnergy) * 100).toFixed(2);
    this.form.patchValue({ usageEnergyRate });
  }

  // selectDevice(enegiesType, index, deviceType?) {
  //   if (this.editType === 'view') {
  //     return;
  //   }
  //   this.enegiesType = enegiesType;
  //   this.enegiesTypeIndex = index;
  //   this.deviceType = deviceType || null;
  //   this.isShowObject = true;
  // }

  // removeDevice(form) {
  //   form.get('deviceId').setValue(null);
  //   form.get('deviceName').setValue(null);
  // }

  public invalidKeys: string[] = [];

  public getInvalidKey() {
    return this.invalidKeys[0];
  }

  public isValid(form: FormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        if (!form.controls[key].valid) {
          console.log(key + '为空');
          this.invalidKeys.push(key);
          const controls = form.controls[key] as FormArray;
          if (controls.controls) {
            if (_.isArray(controls.controls)) {
              controls.controls.map((item: FormGroup) => {
                this.isValid(item);
              });
            } else {
              const object = controls.controls as any;
              for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                  const element = object[key];
                  this.isValid(element);
                }
              }
            }
          }
          form.controls[key].markAsDirty();
        }
      }
    }
    return form.valid;
  }

  public saveData() {
    if (!this.isValid(this.form)) {
      const key = this.getInvalidKey();

      var errorInfo = {
        stationId: '电站不能为空',
        parallelCapacity: '并网容量不能为空',
        reportDate: '填报日期不能为空',
        deviceEnergy:
          this.fields['deviceEnergy'].label + '不能为空，且最大保留两位小数',
        maxPower: '当天最大出力最大保留两位小数',
        maxTemp: '最高气温最大保留两位小数',
        minTemp: '最低气温最大保留两位小数',
        avgTemp: '平均气温最大保留两位小数',
        maxWindSpeed: '最大风速最大保留两位小数',
        minWindSpeed: '最小风速最大保留两位小数',
        windSpeed: '平均风速最大保留两位小数',
        irradiation: this.fields['irradiation'].label + '最大保留两位小数',
        inverterHours: this.fields['inverterHours'].label + '最大保留两位小数',
        kwhkwp: this.fields['kwhkwp'].label + '最大保留两位小数',
        forecastHours: this.fields['forecastHours'].label + '最大保留两位小数',
        forecastEnergy:
          this.fields['forecastEnergy'].label + '最大保留两位小数',
        forecastEnergy2:
          this.fields['forecastEnergy2'].label + '最大保留两位小数',
        forecastWindSpeed:
          this.fields['forecastWindSpeed'].label + '最大保留两位小数',
        forecastPower: this.fields['forecastPower'].label + '最大保留两位小数',
        dailyLoss: this.fields['dailyLoss'].label + '最大保留两位小数',
        svgLoss: 'SVG出线柜损耗最大保留两位小数',
        transformerLoss: '站用变兼接地变损耗最大保留两位小数',
        usageEnergy: '综合厂用电量最大保留两位小数',
        usageEnergyRate: '综合厂用电率最大保留两位小数',
        stopHours: this.fields['stopHours'].label + '最大保留两位小数',
        usageRate: this.fields['usageRate'].label + '最大保留两位小数',
        memo: '特殊情况说明最大500个字符',
      };

      this.mutilservice.popToastView(errorInfo[key] || '请检查输入项');
      return false;
    }
    const data = this.form.value;
    const params = {
      ...data,
      operationDate: data.operationDate
        ? moment(data.operationDate).toDate()
        : null,
      reportDate: data.reportDate ? moment(data.reportDate).toDate() : null,
      maxPowerTime: data.maxPowerTime
        ? moment(data.maxPowerTime).toDate()
        : null,
      loss: !_.isEmpty(data.loss)
        ? data.loss.map((item) => {
            return {
              ...item,
              startTime: item.startTime
                ? moment(item.startTime).toDate()
                : null,
              endTime: item.endTime ? moment(item.endTime).toDate() : null,
            };
          })
        : [],
    };

    if (params.recordId) {
      this.runlogservice.updateJobRecords(params).then((res) => {
        if (res) {
          let toast = this.toastCtrl.create({
            message: '日志保存成功！',
            duration: 500,
            position: 'middle',
          });
          toast.onDidDismiss(() => {
            this.navCtrl.pop();
          });

          toast.present();
        }
      });
    } else {
      this.runlogservice
        .saveJobRecords(params)
        .then((res) => {
          if (res) {
            let toast = this.toastCtrl.create({
              message: '日志保存成功！',
              duration: 500,
              position: 'middle',
            });
            toast.onDidDismiss(() => {
              this.navCtrl.pop();
            });

            toast.present();
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }

  getJobRecordLosses(form) {
    return form.controls.loss.controls;
  }

  get loss() {
    return this.form.controls['loss'] as FormArray;
  }

  addJobRecordLosses() {
    const loss = this.formbuilder.group({
      lossType: [this.selectOptions['lossType'][0].first, Validators.required],
      lossTypeText: [
        this.selectOptions['lossType'][0].second,
        Validators.required,
      ],
      deviceId: [''],
      deviceName: [''],
      lossDesc: ['', Validators.maxLength(300)],
      startTime: [''],
      endTime: [''],
      lossEnergy: [
        '',
        [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)],
      ],
    });
    this.loss.push(loss);
  }

  removeLoss(index) {
    this.loss.removeAt(index);
  }

  editJobRecordLoss(index) {
    const control = this.form.get('loss') as FormArray;
    const value = control.controls[index].value;
    value.startTime = _.isNumber(value.startTime)
      ? moment(value.startTime).format('HH:mm')
      : value.startTime;
    value.endTime = _.isNumber(value.endTime)
      ? moment(value.endTime).format('HH:mm')
      : value.endTime;
    const modal = this.modalCtrl.create(
      JobRecordLossesPage,
      {
        stationId: this.stationId,
        lossType: this.fields['loss.lossType'],
        deviceId: this.fields['loss.deviceId'],
        lossDesc: this.fields['loss.lossDesc'],
        startTime: this.fields['loss.startTime'],
        endTime: this.fields['loss.endTime'],
        lossEnergy: this.fields['loss.lossEnergy'],
        value: value,
      },
      {
        cssClass: 'commonModal jobRecordLossesModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          control.controls[index].setValue(data.value);
        } else if (data.type == 'clear') {
          control.removeAt(index);
        }
      }
    });
    modal.present();
  }

  calculateEnergy(event) {
    console.log(event);
  }

  openInputModal(
    type,
    textType = 'text',
    title = '',
    fixedNumber = 0,
    form,
    index,
    formControl
  ) {
    if (this.editType === 'view') {
      return;
    }

    let value = '';
    if (!form) {
      value = this.form.value[type];
    } else {
      if (formControl) {
        value = this.form.value[form][formControl][index][type];
      } else {
        value = this.form.value[form][index][type];
      }
    }
    const modal = this.modalCtrl.create(
      CommonInputPage,
      {
        value,
        title,
        type: textType,
      },
      {
        cssClass: 'commonModal commonInputModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (!form) {
          this.form.patchValue({
            [type]:
              textType === 'number'
                ? data.value
                  ? _.ceil(data.value, fixedNumber)
                  : null
                : data.value,
          });
        } else {
          if (formControl) {
            const array = (this.form.controls[form] as FormGroup).controls[
              formControl
            ] as FormArray;

            array.at(index).patchValue({
              [type]:
                textType === 'number'
                  ? data.value
                    ? _.ceil(data.value, fixedNumber)
                    : null
                  : data.value,
            });
          } else {
            const array = this.form.controls[form] as FormArray;
            array.at(index).patchValue({
              [type]:
                textType === 'number'
                  ? data.value
                    ? _.ceil(data.value, fixedNumber)
                    : null
                  : data.value,
            });
          }
        }

        if (type === 'deviceEnergy') {
          this.deviceEnergyValueChange();
        }

        if (type === 'dailyLoss') {
          this.dailyLossChange();
        }

        if (type === 'usageEnergy') {
          this.usageEnergyChange();
        }

        if (form !== undefined && index !== undefined) {
          if (type !== 'dailyEnergy') {
            this.calculateDailyEnergyValue(form, formControl, index);
          }
          if (type === 'dailyEnergy' && formControl === '02') {
            this.calculateKwhkwpValue(form, formControl);
          }
          if (type === 'dailyEnergy' && formControl === '03') {
            this.calculateNegativeDailyEnergyValue(form, formControl);
          }
          if (type === 'dailyEnergy' && formControl === '04') {
            this.calculateDeviceEnergyValue(form, formControl);
          }
        }
      }
    });

    modal.present();
  }

  selectEquipment(type, typeText, form, index, formControl) {
    let deviceId = '';
    let deviceName = '';

    if (!form) {
      deviceId = this.form.value[type];
      deviceName = this.form.value[typeText];
    } else {
      if (formControl) {
        deviceId = this.form.value[form][formControl][index][type];
        deviceName = this.form.value[form][formControl][index][typeText];
      } else {
        deviceId = this.form.value[form][index][type];
        deviceName = this.form.value[form][index][typeText];
      }
    }

    this.equipmentFormParams = {
      type,
      typeText,
      form,
      index,
      formControl,
    };

    this.navCtrl.push(EquipmentListPage, {
      stationId: this.stationId,
      isSingle: true,
      deviceId: deviceId,
      deviceName: deviceName,
      deviceType: formControl === '02' || formControl === '03' ? 'DNB' : null,
    });
  }

  openSheetModal(type, typeText, form, index) {
    const options = this.selectOptions[type];
    const buttons = options.map((item) => {
      return {
        text: item.second,
        handler: () => {
          if (!form) {
            this.form.patchValue({
              [type]: item.first,
              [typeText]: item.second,
            });
          } else {
            const data = this.form.get(form) as FormArray;
            data.value[index] = {
              ...data.value[index],
              [type]: item.first,
              [typeText]: item.second,
            };
            this.form.patchValue({
              loss: data.value,
            });
          }
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

  addMemo() {
    const modal = this.modalCtrl.create(
      CommonTextareaPage,
      {
        title: '特殊情况说明',
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
          this.form.patchValue({ memo: data.value });
        } else if (data.type == 'clear') {
          this.form.patchValue({ memo: null });
        }
      }
    });
    modal.present();
  }

  editMemo() {
    const modal = this.modalCtrl.create(
      CommonTextareaPage,
      {
        title: '特殊情况说明',
        value: this.form.value.memo,
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
          this.form.patchValue({ memo: data.value });
        } else if (data.type == 'clear') {
          this.form.patchValue({ memo: null });
        }
      }
    });
    modal.present();
  }
}
