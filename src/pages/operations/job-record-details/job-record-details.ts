import { MutilService } from './../../../providers/util/Mutil.service';
import { JobRecordLossesPage } from './../../util/modal/job-record-losses/job-record-losses';
import {
    ActionSheetController,
    AlertController,
    ToastController,
    LoadingController,
} from 'ionic-angular';
import { RunLogService } from './../../../providers/runlog.service';
import { CommonInputPage } from './../../util/modal/common-input/common-input';
import { ViewController, ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonTextareaPage } from '../../util/modal/common-textarea/common-textarea';
import * as moment from 'moment';
/**
 * Generated class for the JobRecordDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-job-record-details',
    templateUrl: 'job-record-details.html',
})
export class JobRecordDetailsPage {
    toggleBaseInfo = true;
    togglePowerGeneration = false;
    toggleWeatherInfo = false;
    toggleJobRecordLosses = false;
    toggleInverter = false;
    toggleMemo = false;
    toggleCheckIn = false;
    toggleWork01 = false;
    toggleWork02 = false;
    toggleWork03 = false;
    toggleWork04 = false;

    form: FormGroup;
    title: any;
    fields: any;
    stationId: any;
    loss: any = [];
    buttons: any;
    recordId: any;
    orginal_monthEnergy: any;
    orginal_yearEnergy: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private fb: FormBuilder,
        private modalCtrl: ModalController,
        private runlogservice: RunLogService,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private mutilservice: MutilService
    ) {
        this.initForm();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad JobRecordDetailsPage');
        this.stationId = this.navParams.get('stationId');
        this.recordId = this.navParams.get('recordId') ? this.navParams.get('recordId') : 0;
        const loading = this.loadingCtrl.create({
            spinner: 'crescent',
        });

        loading.present();
        this.runlogservice.getRecord(this.recordId, this.stationId).subscribe((res) => {
            loading.dismiss();
            if (res) {
                this.title = res.title;
                this.fields = res.fields;
                this.buttons = res.buttons;
                const values = res.jobRecord;

                this.orginal_monthEnergy = values.monthEnergy || 0;
                this.orginal_yearEnergy = values.yearEnergy || 0;

                for (const key in values) {
                    if (values.hasOwnProperty(key)) {
                        if (
                            key === 'lastMeterValue' ||
                            key === 'lastDailyEnergy' ||
                            key === 'meterValue' ||
                            key === 'dailyEnergy' ||
                            key === 'dailyKwhkwp' ||
                            key === 'maxPower' ||
                            key === 'monthEnergy' ||
                            key === 'monthRate' ||
                            key === 'yearEnergy' ||
                            key === 'yearRate'
                        ) {
                            values[key] = _.ceil(values[key], 2);
                        }
                    }
                }

                values.reportDate = _.isNumber(values.reportDate)
                    ? moment(values.reportDate).format()
                    : values.reportDate;
                if (this.stationId) {
                    values.stationId = this.stationId;
                    values.loss = [];
                    values.checkIn = [];
                    values.works = {
                        '01': [],
                        '02': [],
                        '03': [],
                        '04': [],
                    };
                    this.form.patchValue({ ...values });
                } else {
                    this.stationId = values.stationId;
                    const loss = values.loss;
                    if (loss) {
                        this.loss = loss;
                        let control = this.form.get('loss') as FormArray;
                        loss.map((item) => {
                            control.push(this.initJobRecordLoss());
                        });
                    } else {
                        this.loss = [];
                        values.loss = [];
                    }

                    // fill checkIn 表单
                    const checkIn = values.checkIn;
                    if (checkIn) {
                        checkIn.map((item, index) => {
                            let control = (this.form.get('checkIn') as FormArray).controls[
                                index
                            ].get('users') as FormArray;
                            item.users.map((user) => {
                                control.push(this.buildUserArray());
                            });
                            // control.patchValue(item.users);
                        });
                    } else {
                        values.checkIn = [];
                    }

                    // fill works 表单
                    const works = values.works;
                    if (works) {
                        for (const key in works) {
                            if (works.hasOwnProperty(key)) {
                                const element = works[key];
                                const control = (this.form.get('works') as FormGroup).controls[
                                    key
                                ] as FormArray;
                                element.map((item) => {
                                    control.push(this.initWork());
                                });
                                console.log(control);
                                // control.patchValue(element);
                            }
                        }
                    } else {
                        values.works = [];
                    }
                    values.inverterStart = _.isNumber(values.inverterStart)
                        ? moment(values.inverterStart).format('HH:mm')
                        : values.inverterStart;
                    values.inverterStop = _.isNumber(values.inverterStop)
                        ? moment(values.inverterStop).format('HH:mm')
                        : values.inverterStop;
                    this.form.patchValue({ ...values });
                }
            }
        });
    }

    initForm() {
        this.form = this.fb.group({
            //基本信息
            recordId: new FormControl(null),
            reportDate: new FormControl(null),
            stationId: new FormControl(null),
            stationName: new FormControl(null),
            stationType: new FormControl(null),
            stationTypeText: new FormControl(null),
            operationDate: new FormControl(null),
            capacity: new FormControl(null),
            parallelCapacity: new FormControl(null),
            meterRatio: new FormControl(null),

            //发电情况
            lastMeterValue: new FormControl(null),
            lastDailyEnergy: new FormControl(null),
            meterValue: new FormControl(null),
            dailyEnergy: new FormControl(null),
            dailyKwhkwp: new FormControl(null),
            maxPower: new FormControl(null),
            monthEnergy: new FormControl(null),
            monthRate: new FormControl(null),
            yearEnergy: new FormControl(null),
            yearRate: new FormControl(null),

            //天气情况
            weatherInfo: new FormControl(null),
            weatherInfoText: new FormControl(null),
            irradiation: new FormControl(null),
            airQuality: new FormControl(null),
            airQualityText: new FormControl(null),
            maxTemp: new FormControl(null),
            minTemp: new FormControl(null),
            windDirection: new FormControl(null),
            windDirectionText: new FormControl(null),
            windSpeed: new FormControl(null),
            pm10: new FormControl(null),
            genHoursFine: new FormControl(null),
            genHoursPcloud: new FormControl(null),
            genHoursCloudy: new FormControl(null),
            genHoursWet: new FormControl(null),
            genHoursRain: new FormControl(null),
            genHours: new FormControl(null),

            // 电量损失情况
            loss: this.fb.array([]),

            // 逆变器运行情况
            inverterStart: new FormControl(null),
            inverterStop: new FormControl(null),
            inverterHours: new FormControl(null),

            // 出勤
            checkIn: this.fb.array([
                this.fb.group({
                    code: new FormControl('01'),
                    name: new FormControl('出勤'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('02'),
                    name: new FormControl('轮休'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('03'),
                    name: new FormControl('事假'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('04'),
                    name: new FormControl('病假'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('05'),
                    name: new FormControl('调休'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('06'),
                    name: new FormControl('陪产假'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('07'),
                    name: new FormControl('婚假'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('08'),
                    name: new FormControl('丧假'),
                    users: this.fb.array([]),
                }),
                this.fb.group({
                    code: new FormControl('09'),
                    name: new FormControl('旷工'),
                    users: this.fb.array([]),
                }),
            ]),
            works: this.fb.group({
                '01': this.fb.array([]),
                '02': this.fb.array([]),
                '03': this.fb.array([]),
                '04': this.fb.array([]),
            }),
            memo: new FormControl(null),
        });
    }

    openInputModal(type, editable, textType = 'text') {
        if (!editable) {
            return;
        }
        const modal = this.modalCtrl.create(
            CommonInputPage,
            {
                value: this.form.value[type],
                title: this.fields[type]['name'],
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
                this.form.patchValue({
                    [type]: data.value ? _.ceil(data.value, 2) : null,
                });
                if (type === 'parallelCapacity' || type === 'meterRatio' || type === 'meterValue') {
                    this.form.patchValue({
                        dailyEnergy:
                            (this.form.value.meterRatio || 0) *
                            ((this.form.value.meterValue || 0) -
                                (this.form.value.lastMeterValue || 0)),
                    });
                    console.log(this.form.value.dailyEnergy / this.form.value.parallelCapacity);
                    this.form.patchValue({
                        dailyKwhkwp: this.form.value.parallelCapacity
                            ? _.ceil(
                                  this.form.value.dailyEnergy / this.form.value.parallelCapacity,
                                  2
                              )
                            : null,
                    });
                    if (this.form.value.dailyKwhkwp > 8000) {
                        this.mutilservice.popToastView('今日上网电量超大异常，请修改');
                    }
                    this.form.patchValue({
                        monthEnergy: +this.orginal_monthEnergy + this.form.value.dailyEnergy,
                    });
                    this.form.patchValue({
                        yearEnergy: +this.orginal_yearEnergy + this.form.value.dailyEnergy,
                    });
                } else if (type === 'dailyEnergy') {
                    this.form.patchValue({
                        dailyKwhkwp: this.form.value.parallelCapacity
                            ? _.ceil(
                                  this.form.value.dailyEnergy / this.form.value.parallelCapacity,
                                  2
                              )
                            : null,
                    });
                    this.form.patchValue({
                        monthEnergy: +this.orginal_monthEnergy + this.form.value.dailyEnergy,
                    });
                    this.form.patchValue({
                        yearEnergy: +this.orginal_yearEnergy + this.form.value.dailyEnergy,
                    });
                    if (this.form.value.dailyKwhkwp > 8000) {
                        this.mutilservice.popToastView('今日上网电量超大异常，请修改');
                    }
                }
            }
        });
        modal.present();
    }

    openSheetModal(type, typeText) {
        const options = this.fields[type]['props'];
        const buttons = options.map((item) => {
            return {
                text: item.second,
                handler: () => {
                    this.form.patchValue({
                        [type]: item.first,
                        [typeText]: item.second,
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

    addJobRecordLosses() {
        const control = this.form.get('loss') as FormArray;
        control.push(this.initJobRecordLoss());
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
            },
            {
                cssClass: 'commonModal jobRecordLossesModal',
                showBackdrop: true,
                enableBackdropDismiss: true,
            }
        );
        modal.onDidDismiss((data) => {
            if (data) {
                console.log(this.loss);
                if (data.type == 'ok') {
                    this.loss.push(data.value);
                } else if (data.type == 'clear') {
                    control.removeAt(this.loss.length);
                }
                console.log(this.loss);
                this.form.get('loss').patchValue(this.loss);
            } else {
                control.removeAt(this.loss.length);
            }
        });
        modal.present();
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

    initJobRecordLoss() {
        return new FormGroup({
            lossId: new FormControl(null),
            lossType: new FormControl(null),
            lossTypeText: new FormControl(null),
            deviceId: new FormControl(null),
            deviceName: new FormControl(null),
            lossDesc: new FormControl(null),
            startTime: new FormControl(null),
            endTime: new FormControl(null),
            lossEnergy: new FormControl(null),
            memo: new FormControl(null),
        });
    }

    buildUserArray() {
        return new FormGroup({
            userId: new FormControl(null),
            userName: new FormControl(null),
            icon: new FormControl(null),
            account: new FormControl(null),
            deptName: new FormControl(null),
        });
    }

    getJobRecordLosses(form) {
        return form.controls.loss.controls;
    }

    addUser(index) {
        const values = (this.form.get('checkIn') as FormArray).controls[index].get('users').value;
        const selectedItem = [];
        values.map((item) => {
            selectedItem.push({
                userId: item.userId,
                realName: item.userName,
                userName: item.account,
                icon: item.icon,
                deptName: item.deptName,
            });
        });
        const modal = this.modalCtrl.create(CommonUserPage, {
            selectedItem,
        });
        modal.onDidDismiss((data) => {
            if (data) {
                if (data.type == 'ok') {
                    let control = (this.form.get('checkIn') as FormArray).controls[index].get(
                        'users'
                    ) as FormArray;
                    while (control.length !== 0) {
                        control.removeAt(0);
                    }
                    const values = [];
                    data.value.map((item) => {
                        values.push({
                            userId: item.userId,
                            userName: item.realName,
                            account: item.userName,
                            icon: item.icon,
                            deptName: item.deptName,
                        });
                        control.push(this.buildUserArray());
                    });
                    control.patchValue(values);
                }
            }
        });
        modal.present();
    }

    getCheckIn(form) {
        return form.controls.checkIn.controls;
    }

    getUsersItem(form) {
        return form.controls.users.controls;
    }

    getWordItem(form, type) {
        return form.controls.works.controls[type].controls;
    }

    deleteUser(i, j) {
        let control = (this.form.get('checkIn') as FormArray).controls[i].get('users') as FormArray;
        control.removeAt(j);
    }

    addWork(type, index) {
        const control = (this.form.get('works') as FormGroup).controls[index] as FormArray;
        control.push(this.initWork());
        const control_length = control.value.length;
        const modal = this.modalCtrl.create(
            CommonTextareaPage,
            {
                title: this.fields[type]['name'],
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
                    control.controls[control_length - 1].setValue({
                        workDesc: data.value,
                        workType: index,
                        workId: null,
                        recordId: null,
                        orderNo: null,
                    });
                } else if (data.type == 'clear') {
                    control.removeAt(control_length - 1);
                }
            } else {
                control.removeAt(control_length - 1);
            }
        });
        modal.present();
    }

    editWork(type, index, k) {
        const control = (this.form.get('works') as FormGroup).controls[index] as FormArray;
        const value = control.controls[k].value;
        const modal = this.modalCtrl.create(
            CommonTextareaPage,
            {
                title: this.fields[type]['name'],
                value: value.workDesc,
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
                    control.controls[k].setValue({
                        workDesc: data.value,
                        workType: index,
                    });
                } else if (data.type == 'clear') {
                    control.removeAt(k);
                }
            }
        });
        modal.present();
    }

    initWork() {
        return new FormGroup({
            workDesc: new FormControl(null),
            workType: new FormControl(null),
            workId: new FormControl(null),
            orderNo: new FormControl(null),
            recordId: new FormControl(null),
        });
    }

    addMemo() {
        const modal = this.modalCtrl.create(
            CommonTextareaPage,
            {
                title: '备注',
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
                title: '备注',
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

    buttonFunction(type) {
        if (type === 'save') {
            this.saveFunction();
        } else if (type === 'delete') {
            this.deleteFunction();
        }
    }

    saveFunction() {
        for (const key in this.fields) {
            if (this.fields.hasOwnProperty(key)) {
                const element = this.fields[key];
                if (this.form.value[key] === null && !element.nullable) {
                    let alert = this.alertCtrl.create({
                        title: '警告',
                        subTitle: element.name + '必填!',
                        buttons: ['关闭'],
                    });
                    alert.present();
                    return;
                }
                if (key === 'dailyKwhkwp') {
                    if (this.form.value[key] > 8000) {
                        let alert = this.alertCtrl.create({
                            title: '警告',
                            subTitle: '今日上网电量超大异常，请修改',
                            buttons: ['关闭'],
                        });
                        alert.present();
                        return;
                    }
                }
            }
        }
        // 处理电量损失情况的时间
        const values = _.cloneDeep(this.form.value);
        if (values && values.loss) {
            values.loss.map((item) => {
                if (item.startTime) {
                    if (_.isNumber(item.startTime)) {
                        item.startTime = moment(item.startTime).format();
                    } else {
                        const reportDate = moment(values.reportDate).format('YYYY-MM-DD');
                        item.startTime = moment(reportDate + ' ' + item.startTime).format();
                    }
                }
                if (item.endTime) {
                    if (_.isNumber(item.endTime)) {
                        item.endTime = moment(item.endTime).format();
                    } else {
                        const reportDate = moment(values.reportDate).format('YYYY-MM-DD');
                        item.endTime = moment(reportDate + ' ' + item.endTime).format();
                    }
                }
            });
        }

        //逆变器运行情况
        let inverterStart = values.inverterStart;
        if (inverterStart) {
            if (_.isNumber(inverterStart)) {
                values.inverterStart = moment(inverterStart).format();
            } else {
                const reportDate = moment(values.reportDate).format('YYYY-MM-DD');
                values.inverterStart = moment(reportDate + ' ' + values.inverterStart).format();
            }
        }
        let inverterStop = values.inverterStop;
        if (inverterStop) {
            if (_.isNumber(inverterStop)) {
                values.inverterStop = moment(inverterStop).format();
            } else {
                const reportDate = moment(values.reportDate).format('YYYY-MM-DD');
                values.inverterStop = moment(reportDate + ' ' + values.inverterStop).format();
            }
        }

        //出勤情况
        const unique_user = [];
        for (const item of values.checkIn) {
            for (const user of item.users || []) {
                if (unique_user.indexOf(user.userId) === -1) {
                    unique_user.push(user.userId);
                } else {
                    this.mutilservice.popToastView('人员只能出现一种出勤情况');
                    return;
                }
            }
        }

        if (this.recordId) {
            this.runlogservice.updateRecord(values).subscribe((res) => {
                let toast = this.toastCtrl.create({
                    message: '日志更新成功！',
                    duration: 500,
                    position: 'middle',
                });
                toast.onDidDismiss(() => {
                    this.navCtrl.pop();
                });
                toast.present();
            });
        } else {
            const confirm = this.alertCtrl.create({
                title: '提示',
                message: `请确认今日电量：${this.form.value.dailyEnergy}kWh 是否准确？`,
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                            console.log('Disagree clicked');
                        },
                    },
                    {
                        text: '确定',
                        handler: () => {
                            this.runlogservice.saveRecord(values).subscribe((res) => {
                                let toast = this.toastCtrl.create({
                                    message: '日志保存成功！',
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
            confirm.present();
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

    public setInverterHours(params) {
        let reportDate = moment(this.form.value.reportDate).format('YYYY-MM-DD');
        let start = this.form.value.inverterStart;
        let end = this.form.value.inverterStop;
        if (start && end) {
            let intervalTime =
                moment(reportDate + ' ' + end + ':00').valueOf() -
                moment(reportDate + ' ' + start + ':00').valueOf();
            if (intervalTime > 0) {
                this.form.patchValue({
                    inverterHours:
                        Math.round(
                            (Math.floor(intervalTime / 3600000) +
                                (intervalTime % 3600000) / 3600000) *
                                10
                        ) / 10,
                });
            } else {
                this.mutilservice.popToastView('开始发电时间要小于停止发电时间！');
                this.form.patchValue({
                    inverterHours: null,
                });
                return this.form.patchValue({
                    [params]: null,
                });
            }
        }
    }
}
