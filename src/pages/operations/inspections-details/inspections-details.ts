import { NativeService } from './../../../providers/location-plugin';
import { EquipmentListPage } from './../../util/common-equipment/equipmentList';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ImagePicker } from '@ionic-native/image-picker';
import { PluginService } from './../../../providers/util/plugin.service';
import { MutilService } from './../../../providers/util/Mutil.service';
import { DefesService } from './../../../providers/defes.servicer';
import {
  ActionSheetController,
  AlertController,
  Platform,
  Events,
} from 'ionic-angular';
import { InspectionsProvider } from './../../../providers/inspections.service';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CommonStationPage } from '../../util/common-station/common-station';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonInputPage } from '../../util/modal/common-input/common-input';
import { CommonTextareaPage } from '../../util/modal/common-textarea/common-textarea';
import * as _ from 'lodash';
import * as moment from 'moment';
import { InspectionDevicePage } from './inspection-device/inspection-device';
import { Geolocation } from '@ionic-native/geolocation';
import { transform, WGS84, BD09, GCJ02 } from 'gcoord';
import { CommonDispatchPage } from '../../util/modal/common-dispatch/common-dispatch';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { APP_CONFIG, AppConfig } from '../../../models/app-config';
import { buildWorkFlow } from './work-flow.chart';
import { CommonCheckPage } from '../../util/modal/common-check/common-check';
declare const BMap;

/**
 * Generated class for the InspectionsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inspections-details',
  templateUrl: 'inspections-details.html',
})
export class InspectionsDetailsPage {
  @ViewChild('container') mapElement: ElementRef;
  @ViewChild('echart') echart;
  title: string;
  form: FormGroup;
  inspectionId: any;
  inspectionType: any;
  fields: any;
  buttons: any = [];

  toggleBaseInfo = true;
  toggleInspectionTracks = false;
  toggleInspectionCheck = false;
  toggleWorkFlow = false;
  toggleWorkflowLogs = false;
  toggleBackEndData = false;

  toggleComment = false;
  buttonToggle = false;
  ccPermission: any;
  ccUsers: any = [];
  commentsList: any = [];
  orderId: any;
  firstLoadTracks: boolean = true;

  icons = {
    '01': new BMap.Icon(
      'assets/imgs/map/map-mask-01.svg',
      new BMap.Size(32, 32),
      {
        anchor: new BMap.Size(32, 32),
      }
    ),
    '02': new BMap.Icon(
      'assets/imgs/map/map-mask-02.svg',
      new BMap.Size(32, 32),
      {
        anchor: new BMap.Size(16, 32),
      }
    ),
    '03': new BMap.Icon(
      'assets/imgs/map/map-mask-03.svg',
      new BMap.Size(32, 32),
      {
        anchor: new BMap.Size(16, 32),
      }
    ),
    '04': new BMap.Icon(
      'assets/imgs/map/map-mask-04.svg',
      new BMap.Size(32, 32),
      {
        anchor: new BMap.Size(16, 32),
      }
    ),
  };
  trackInterval: number;
  objToggle = [];
  uploadPicParams: {};
  canLeave: boolean = false;
  isTracking: boolean;
  groupId: any;
  fileBasePath: string;
  nodes: any;
  links: any;
  options: any;
  objGroups: any[];
  map: any;
  objPermission: any = 2;
  centerPoint: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private inspectionsprovider: InspectionsProvider,
    private defesservice: DefesService,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    private mutilservice: MutilService,
    private camera: Camera,
    private pluginservice: PluginService,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private filePicker: IOSFilePicker,
    private photoViewer: PhotoViewer,
    private nativeservice: NativeService,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.initForm();
    this.fileBasePath = this.appConfig.fileEndpoint;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionsDetailsPage');
    this.inspectionId = this.navParams.get('inspectionId') || 0;
    this.inspectionType = this.navParams.get('inspectionType');

    this.getInspectionsDetails();

    this.getPosition().then((res: any) => {
      if (res && res.longitude && res.latitude) {
        this.centerPoint = [+res.longitude, +res.latitude];
      }
    });
  }

  ionViewWillEnter() {
    let equipmentList = this.navParams.get('equipmentList');
    if (equipmentList) {
      const equipment = equipmentList[0];
      this.navParams.data.equipmentList = null;
      const params = {
        deviceId: equipment.deviceId,
        inspectionType: this.inspectionType,
        objGroup: this.groupId,
        objId: 0,
      };
      this.inspectionsprovider.getObj(params).subscribe((res) => {
        this.canLeave = true;
        this.navCtrl.push(InspectionDevicePage, {
          objInfo: { ...res, inspectionId: this.inspectionId },
          isTracking: true,
          objPermission: this.objPermission,
        });
      });
    }
    let isTracking = this.navParams.get('isTracking');
    if (isTracking === true) {
      this.navParams.data.isTracking = null;
      this.canLeave = false;
    }
    let objInfo = this.navParams.get('objInfo');
    if (objInfo) {
      this.navParams.data.objInfo = null;
      const data = objInfo.params;
      const control = this.form.get('objGroups') as FormArray;
      let objGroupValue = control.value;
      if (objInfo.type === 'add') {
        objGroupValue.map((item, index) => {
          if (item.groupId === data.objGroup) {
            const objControl = control.controls[index].get('objs') as FormArray;
            objControl.push(this.initObj());
            objGroupValue[index].objs.push(data);
            this.form.get('objGroups').patchValue(objGroupValue);
          }
        });
      } else if (objInfo.type === 'edit') {
        objGroupValue.map((item, index) => {
          if (item.groupId === data.objGroup) {
            item.objs.map((objItem, i) => {
              if (objItem.objId === data.objId) {
                objGroupValue[index].objs[i] = data;
                this.form.get('objGroups').patchValue(objGroupValue);
              }
            });
          }
        });
      } else if (objInfo.type === 'delete') {
        objGroupValue.map((item, index) => {
          if (item.groupId === data.objGroup) {
            _.remove(objGroupValue[index].objs, (o) => {
              return o.objId === data.objId;
            });
            const objControl = control.controls[index].get('objs') as FormArray;
            objControl.removeAt(
              _.findIndex(objGroupValue[index].objs, (o) => {
                return o.objId === data.objId;
              })
            );
          }
        });
      }
      this.objGroups = [];
      this.form.value.objGroups.map((item) => {
        item.objs.map((i) => {
          this.objGroups.push({
            objId: i.objId,
            latitude: +i.latitude,
            longitude: +i.longitude,
            inspectionStatus: i.inspectionStatus,
            deviceNo: i.deviceNo,
            groupType: item.groupType,
          });
        });
      });
      this.showTracks(true);
    }
  }

  ionViewWillLeave() {
    if (this.isTracking === true && !this.canLeave) {
      clearInterval(this.trackInterval);
      this.trackInterval = null;
    }
  }

  initForm() {
    this.form = this.fb.group({
      inspectionId: new FormControl(null),
      orderId: new FormControl(null),
      inspectionCode: new FormControl(null),
      stationId: new FormControl(null),
      stationName: new FormControl(null),
      inspectionType: new FormControl(null),
      inspectionTypeText: new FormControl(null),
      dispatcher: new FormControl(null),
      dispatcherName: new FormControl(null),
      responsiblePerson: new FormControl(null),
      responsiblePersonName: new FormControl(null),
      players: this.fb.array([]),
      playersText: new FormControl(null),
      planStartTime: new FormControl(null),
      planEndTime: new FormControl(null),
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      workHours: new FormControl(null),
      objGroups: this.fb.array([]),

      power: new FormControl(null),
      dayEnergy: new FormControl(null),

      // 抢修单检查
      checkStatus: new FormControl(null),
      checkStatusText: new FormControl(null),
      checker: new FormControl(null),
      checkerName: new FormControl(null),
      checkTime: new FormControl(null),
      checkMemo: new FormControl(null),

      // 工作流程
      workflow: this.fb.group({
        nodes: this.fb.array([]),
        links: this.fb.array([]),
      }),

      // 流程日志
      workflowLogs: this.fb.array([]),

      //抄送
      ccUsers: this.fb.array([]),
    });
  }

  getInspectionsDetails() {
    this.inspectionsprovider
      .getInspectionsDetails(this.inspectionId, {
        inspectionType: this.inspectionType,
      })
      .subscribe((res) => {
        this.fillValue(res);
      });
  }

  fillValue(res) {
    this.title = res.title;

    let values = res.inspection;
    if (res.fields) {
      this.fields = res.fields;
    }
    if (res.buttons) {
      this.buttons = res.buttons;
    }

    this.orderId = values.orderId;
    if (values.inspectionId) {
      this.inspectionId = values.inspectionId;
    }
    // 同组巡检人员
    if (values.players !== null) {
      const control = this.form.get('players') as FormArray;
      while (control.length) {
        control.removeAt(control.length - 1);
      }
      const playersText = values.players.map((item) => {
        control.push(this.initPlayers());
        return item.userName;
      });
      values.playersText = playersText.join(',');
    } else {
      values.players = [];
    }

    // 计划开始时间
    values.planStartTime = _.isNumber(values.planStartTime)
      ? moment(values.planStartTime).format()
      : values.planStartTime;
    // 计划结束时间
    values.planEndTime = _.isNumber(values.planEndTime)
      ? moment(values.planEndTime).format()
      : values.planEndTime;
    // 实际开始时间
    values.startTime = _.isNumber(values.startTime)
      ? moment(values.startTime).format()
      : values.startTime;
    // 实际结束时间
    values.endTime = _.isNumber(values.endTime)
      ? moment(values.endTime).format()
      : values.endTime;

    // 检查时间
    values.checkTime = _.isNumber(values.checkTime)
      ? moment(values.checkTime).format()
      : values.checkTime;

    if (values.objGroups !== null) {
      const control = this.form.get('objGroups') as FormArray;
      while (control.length) {
        control.removeAt(control.length - 1);
      }
      this.objGroups = [];
      values.objGroups.map((item, index) => {
        this.objToggle.push({ show: false });
        control.push(this.initObjGroups());
        const objControl = control.controls[index].get('objs') as FormArray;
        while (objControl.length) {
          objControl.removeAt(objControl.length - 1);
        }
        item.objs.map((i) => {
          objControl.push(this.initObj());
          this.objGroups.push({
            objId: i.objId,
            latitude: +i.latitude,
            longitude: +i.longitude,
            inspectionStatus: i.inspectionStatus,
            deviceNo: i.deviceNo,
            groupType: item.groupType,
          });
        });
      });
    } else {
      values.objGroups = [];
      this.objGroups = [];
    }

    //工作流程
    if (values.workflow !== null) {
      const workflow = values.workflow;
      for (const key in workflow) {
        if (workflow.hasOwnProperty(key)) {
          const element = workflow[key];
          if (key === 'nodes') {
            this.nodes = element;
            const control = (this.form.get('workflow') as FormGroup).controls[
              key
            ] as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            element.map((item) => {
              control.push(this.initNodes());
            });
          } else if (key === 'links') {
            this.links = element;
            const control = (this.form.get('workflow') as FormGroup).controls[
              key
            ] as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            element.map((item) => {
              control.push(this.initLinks());
            });
          }
        }
      }
      this.options = buildWorkFlow(this.links, this.nodes);
    } else {
      values.workflow = {};
    }

    // 流程日志
    if (values.workflowLogs) {
      let control = this.form.get('workflowLogs') as FormArray;
      while (control.length) {
        control.removeAt(control.length - 1);
      }
      values.workflowLogs.map((item) => {
        control.push(this.initWorkflowLogs());
      });
    } else {
      values.workflowLogs = [];
    }
    // 抄送
    if (values.ccUsers !== null) {
      this.ccUsers = values.ccUsers;
      const control = this.form.get('ccUsers') as FormArray;
      while (control.length) {
        control.removeAt(control.length - 1);
      }
      values.ccUsers.map((item) => {
        control.push(this.initCcUser());
      });
    } else {
      this.ccUsers = [];
      values.ccUsers = [];
    }

    if (values.comments !== null) {
      this.commentsList = values.comments;
    } else {
      this.commentsList = [];
      values.comments = [];
    }

    this.ccPermission = res.ccPermission;
    this.objPermission = res.objPermission;

    this.form.patchValue(values);

    if (values.inspectionStatus === '02') {
      this.saveTracks();
    } else {
      if (this.trackInterval) {
        clearInterval(this.trackInterval);
        this.trackInterval = null;
      }
    }
  }

  // 电站选择
  selectStation(event) {
    let modal = this.modalCtrl.create(CommonStationPage, {});
    modal.onDidDismiss((e) => {
      if (e) {
        this.form.patchValue({
          stationId: e.id,
          stationName: e.title,
        });
      }
    });
    modal.present({ keyboardClose: true });
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

  // 人员选择器
  selectUser(id, name) {
    const value = this.form.value;
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: true,
      selectedItem: [{ userId: value[id], userName: value[name] }],
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.form.patchValue({
            [id]: data.value[0] ? data.value[0].userId : null,
            [name]: data.value[0] ? data.value[0].realName : null,
          });
        } else {
          this.form.patchValue({
            [id]: null,
            [name]: null,
          });
        }
      }
    });
    modal.present();
  }

  // 同组巡检人员
  selectplayers(event, editable) {
    const value = this.form.value;
    const selectedItem = [];
    value.players.map((item) => {
      selectedItem.push({
        userId: item.userId,
        realName: item.userName,
        userName: item.account,
        icon: item.userIcon,
        deptName: item.deptName,
      });
    });
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: false,
      selectedItem: selectedItem,
      editable,
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          const control = this.form.get('players') as FormArray;
          while (control.length) {
            control.removeAt(control.length - 1);
          }
          const players = [];
          const playersText = data.value.map((item) => {
            players.push({
              userId: item.userId,
              userName: item.realName,
              account: item.userName,
              userIcon: item.icon,
              deptName: item.deptName,
            });
            control.push(this.initPlayers());
            return item.realName;
          });
          this.form.get('players').patchValue(players);
          this.form.get('playersText').patchValue(playersText.join(','));
        }
      } else if (data && data.length === 0) {
        this.form.patchValue({
          playersText: '',
          players: [],
        });
      }
    });
    modal.present();
  }

  initPlayers() {
    return new FormGroup({
      userId: new FormControl(null),
      userName: new FormControl(null),
      account: new FormControl(null),
      userIcon: new FormControl(null),
      deptName: new FormControl(null),
    });
  }

  openInputModal(type, editable, inputType = 'text') {
    if (!editable) {
      return;
    }
    const modal = this.modalCtrl.create(
      CommonInputPage,
      {
        value: this.form.value[type],
        title: this.fields[type]['name'],
        type: inputType,
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
          [type]: data.value,
        });
      }
    });
    modal.present();
  }

  // 多行文本内容
  addTextarea(title, key, editable) {
    if (!editable) {
      return;
    }
    const modal = this.modalCtrl.create(
      CommonTextareaPage,
      {
        title,
        value: this.form.value[key],
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
          this.form.patchValue({ [key]: data.value });
        } else if (data.type == 'clear') {
          this.form.patchValue({ [key]: null });
        }
      }
    });
    modal.present();
  }

  ccUserEvent(data) {
    const control = this.form.get('ccUsers') as FormArray;
    while (control.length) {
      control.removeAt(control.length - 1);
    }
    data.map((item) => {
      control.push(this.initCcUser());
    });
    this.form.patchValue({
      ccUsers: data,
    });
  }

  initCcUser() {
    return new FormGroup({
      userId: new FormControl(null),
      userName: new FormControl(null),
    });
  }

  buttonFunction(button) {
    // 表单检查
    if (button.formCheck === '1') {
      this.defesservice.checkNullable(button.targetNodeId).subscribe((res) => {
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            if (key.indexOf('.') === -1) {
              const element = res[key];
              if (this.form.value[key] === null && !element) {
                let alert = this.alertCtrl.create({
                  title: '警告',
                  subTitle: this.fields[key].name + '字段不能为空',
                  buttons: ['关闭'],
                });
                alert.present();
                return;
              }
            } else {
              let aNewKey = key.split('.');
              const element = res[key];
              if (this.form.value[aNewKey[0]].length > 0 && !element) {
                let flag = true;
                this.form.value[aNewKey[0]].every((item) => {
                  if (item[aNewKey[1]] === null) {
                    let alert = this.alertCtrl.create({
                      title: '警告',
                      subTitle: this.fields[aNewKey[0]].name + '字段不能为空',
                      buttons: ['关闭'],
                    });
                    alert.present();
                    flag = false;
                    return false;
                  }
                });
                if (!flag) {
                  return;
                }
              }
            }
          }
        }
        this.switchFunction(button);
      });
    } else {
      this.switchFunction(button);
    }
  }

  buttonFlex(length) {
    switch (length) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-6';
      case 3:
        return 'col-4';
      case 4:
        return 'col-3';
      default:
        break;
    }
  }

  switchFunction(button) {
    switch (button.buttonAction) {
      // 派单
      case 'create':
        this.createFunction(button);
        break;
      // 开始
      case 'start':
        this.startFunction(button);
        break;
      // 驳回
      case 'reject':
        this.rejectFunction(button);
        break;
      // 完成
      case 'finish':
        this.finishFunction(button);
        break;
      // 检查
      case '$check$':
        this.checkFunction();
        break;
      case 'delete':
        this.deleteFunction();
        break;
      case '$remind$':
        this.remindFunction();
        break;
    }
  }

  createFunction(button) {
    const modal = this.modalCtrl.create(
      CommonDispatchPage,
      {},
      {
        cssClass: 'commonModal commonDispatchModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          if (!this.formatISOTime()) {
            return;
          }
          let params = {
            title: this.title,
            inspection: {
              ...this.form.value,
              inspectionId: null,
              inspectionCode: null,
              objGroups: null,
            },
            action: button,
            nextUserIds: data.value.nextUserIds,
            memo: data.value.memo,
          };
          this.inspectionsprovider
            .inspectionsAction(params)
            .subscribe((res) => {
              this.mutilservice.popToastView('提交成功');
              this.navCtrl.getPrevious().data.freshPage = true;
              this.navCtrl.pop();
            });
        }
      }
    });
    modal.present();
  }

  startFunction(button) {
    if (this.inspectionId) {
      this.form.patchValue({
        startTime: moment().format(),
      });
      if (!this.formatISOTime()) {
        return;
      }
      const params = {
        title: this.title,
        inspection: {
          ...this.form.value,
          objGroups: null,
        },
        action: button,
        nextUserIds: null,
        memo: null,
      };
      this.inspectionsprovider
        .inspectionsUpdateAction(params)
        .subscribe((res) => {
          this.fillValue(res);
          this.mutilservice.popToastView('巡检开始');
        });
    } else {
      this.form.patchValue({
        startTime: moment().format(),
      });
      if (!this.formatISOTime()) {
        return;
      }
      const params = {
        title: this.title,
        inspection: {
          ...this.form.value,
          objGroups: null,
        },
        action: button,
        nextUserIds: null,
        memo: null,
      };
      this.inspectionsprovider.inspectionsAction(params).subscribe((res) => {
        this.fillValue(res);
        this.mutilservice.popToastView('巡检开始');
      });
    }
  }

  saveTracks() {
    this.isTracking = true;
    let tracks = [];
    this.getPosition().then((track) => {
      tracks.push(track);
    });
    this.trackInterval = setInterval(() => {
      this.getPosition().then((track: any) => {
        tracks.push(track);
        if (tracks.length === 3) {
          this.inspectionsprovider
            .saveTracks(this.inspectionId, tracks)
            .subscribe((res) => {
              this.showTracks(true);
            });
          tracks = [];
        }
      });
    }, 1000 * 60);
  }

  // 拒绝
  rejectFunction(button) {
    const modal = this.modalCtrl.create(
      CommonTextareaPage,
      {
        title: '说明',
      },
      {
        cssClass: 'commonModal commonTextareaModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          if (!this.formatISOTime()) {
            return;
          }
          let params = {
            title: this.title,
            inspection: {
              ...this.form.value,
              objGroups: null,
            },
            action: button,
            nextUserIds: null,
            memo: data.value,
          };
          this.inspectionsprovider
            .inspectionsUpdateAction(params)
            .subscribe((res) => {
              this.mutilservice.popToastView('提交成功');
              this.navCtrl.getPrevious().data.freshPage = true;
              this.navCtrl.pop();
            });
        }
      }
    });
    modal.present();
  }

  finishFunction(button) {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定巡检已完成么？完成后将无法再增加或修改巡检内容',
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
            if (!this.formatISOTime()) {
              return;
            }
            const params = {
              title: this.title,
              inspection: {
                ...this.form.value,
                objGroups: null,
              },
              action: button,
              nextUserIds: null,
              memo: null,
            };
            this.inspectionsprovider
              .inspectionsAction(params)
              .subscribe((res) => {
                this.mutilservice.popToastView('提交成功');
                this.navCtrl.getPrevious().data.freshPage = true;
                this.navCtrl.pop();
              });
          },
        },
      ],
    });
    confirm.present();
  }

  // 检查操作
  checkFunction() {
    const modal = this.modalCtrl.create(
      CommonCheckPage,
      {
        options: this.fields['checkStatus'].props,
      },
      {
        cssClass: 'commonModal commonCheckModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          let params = {
            inspectionId: this.inspectionId,
            checkStatus: data.value.checkStatus,
            checkMemo: data.value.checkMemo,
          };
          this.inspectionsprovider.check(params).subscribe((res: any) => {
            this.mutilservice.popToastView('提交成功');
            res.checkTime = _.isNumber(res.checkTime)
              ? moment(res.checkTime).format('YYYY-MM-DD HH:mm')
              : res.checkTime;
            this.form.patchValue(res);
          });
        }
      }
    });
    modal.present();
  }

  // 删除
  deleteFunction() {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定要删除该巡检单吗?',
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
            const inspectionId = this.inspectionId;
            this.inspectionsprovider.check(inspectionId).subscribe((res) => {
              this.mutilservice.popToastView('删除成功');
              this.navCtrl.getPrevious().data.freshPage = true;
              this.navCtrl.pop();
            });
          },
        },
      ],
    });
    confirm.present();
  }

  // 催单
  remindFunction() {
    this.inspectionsprovider.remind(this.inspectionId).subscribe((res) => {
      this.mutilservice.popToastView('已发送催单消息');
    });
  }

  getPosition() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return this.nativeservice
        .getUserLocation()
        .then((data) => {
          const point = transform(
            [+data.lng, +data.lat], // 经纬度坐标
            GCJ02, // 当前坐标系
            BD09 // 目标坐标系
          );
          return {
            latitude: point[1], //维度
            longitude: point[0], //经度
            trackTime: moment().valueOf(), //获取坐标的时间
          };
        })
        .catch((error) => {
          console.log('Error getting location', error);
        });
    } else {
      return this.geolocation
        .getCurrentPosition({
          enableHighAccuracy: true,
        })
        .then((data) => {
          const point = transform(
            [+data.coords.longitude, +data.coords.latitude], // 经纬度坐标
            WGS84, // 当前坐标系
            BD09 // 目标坐标系
          );
          return {
            latitude: point[1], //维度
            longitude: point[0], //经度
            trackTime: data.timestamp, //获取坐标的时间
          };
        })
        .catch((error) => {
          console.log('Error getting location', error);
        });
    }
  }

  showMoreButtons() {
    this.buttonToggle = !this.buttonToggle;
  }

  showTracks(reload?) {
    if (!reload) {
      this.toggleInspectionTracks = !this.toggleInspectionTracks;
    }
    if (!this.inspectionId) {
      return;
    }
    if (this.toggleInspectionTracks || reload) {
      this.firstLoadTracks = false;

      this.inspectionsprovider.getTracks(this.inspectionId).subscribe((res) => {
        var tracks = res;
        // 创建地图实例
        this.map = new BMap.Map(this.mapElement.nativeElement);

        const top_right_navigation = new BMap.NavigationControl({
          anchor: 1,
          type: 3,
        });
        this.map.addControl(top_right_navigation);

        this.map.enableDragging();
        this.map.enableScrollWheelZoom(true);

        let points = [];
        for (const i in tracks) {
          points.push(
            new BMap.Point(+tracks[i].longitude, +tracks[i].latitude)
          );
        }
        // 创建点坐标, 设置中心点坐标和地图级别
        if (_.isEmpty(points)) {
          let centerPoint;
          if (this.centerPoint.length > 0) {
            centerPoint = new BMap.Point(
              this.centerPoint[0],
              this.centerPoint[1]
            );
          } else {
            centerPoint = new BMap.Point(116.404, 39.915);
          }
          this.map.centerAndZoom(centerPoint, 15);
        } else {
          const viewPort = this.map.getViewport(points);
          this.map.centerAndZoom(viewPort.center, viewPort.zoom);
        }
        var polyline = new BMap.Polyline(points, {
          strokeColor: '#37A2DA',
          strokeWeight: 2,
          strokeOpacity: 1,
        });
        polyline.disableMassClear();
        // 绘制折线
        this.map.addOverlay(polyline);
        // 设置最佳视野
        this.map.setViewport(points);
        this.createLocationControl(this.map);

        var objs = this.objGroups;
        for (const i in objs) {
          if (objs[i].groupType === 'device') {
            var marker = new BMap.Marker(
              new BMap.Point(+objs[i].longitude, +objs[i].latitude),
              {
                title: objs[i].deviceNo,
                icon: this.icons[objs[i].inspectionStatus],
              }
            );
            marker.addEventListener('click', () => {
              console.log(objs[i].objId);
            });
            this.map.addOverlay(marker);
          }
        }
      });
    }
  }

  // 地图定位
  createLocationControl(map) {
    function MapTypeControl() {
      // 设置默认停靠位置和偏移量
      this.defaultAnchor = 3;
      this.defaultOffset = new BMap.Size(10, 10);
    }
    MapTypeControl.prototype = new BMap.Control();
    MapTypeControl.prototype.initialize = () => {
      // 创建一个DOM元素
      var div = document.createElement('div'); // 添加文字说明
      div.style.width = '34px';
      div.style.height = '34px';
      div.style.background = 'rgba(255,255,255,0.8)';
      div.style.textAlign = 'center';
      div.style.borderRadius = '3px';
      div.style.border = '1px solid rgba(255,255,255,0.5);';
      var min = document.createElement('img');
      min.src = 'assets/imgs/map/location.png';
      min.style.width = '25px';
      min.style.marginTop = '5px';
      min.style.marginTop = '5px';
      min.onclick = () => {
        this.getPosition().then((data: any) => {
          map.panTo(new BMap.Point(+data.longitude, +data.latitude));
        });
      };
      div.appendChild(min);
      map.getContainer().appendChild(div); // 将DOM元素返回
      return div;
    };
    var myMapTypeCtrl = new MapTypeControl(); // 添加到地图当中

    map.addControl(myMapTypeCtrl);
  }

  initObjGroups() {
    return new FormGroup({
      groupId: new FormControl(null),
      groupName: new FormControl(null),
      groupType: new FormControl(null),
      deviceType: new FormControl(null),
      objs: this.fb.array([]),
    });
  }

  initObj() {
    return new FormGroup({
      objId: new FormControl(null),
      inspectionId: new FormControl(null),
      standardId: new FormControl(null),
      objGroup: new FormControl(null),
      psrId: new FormControl(null),
      deviceId: new FormControl(null),
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      inspectionStatus: new FormControl(null),
      updateTime: new FormControl(null),
      updater: new FormControl(null),
      deviceNo: new FormControl(null),
      deviceName: new FormControl(null),
      inspectionStatusText: new FormControl(null),
      docId: new FormControl(null),
      uri: new FormControl(null),
      items: new FormControl(null),
      status: new FormControl(null),
    });
  }

  getObjGroups(form) {
    return form.controls.objGroups.controls;
  }

  getObjs(form) {
    return form.controls.objs.controls;
  }

  addObj(objGroup, index) {
    if (!this.form.value.stationId) {
      this.mutilservice.popToastView('请先选择电站');
      return;
    }
    if (!this.form.value.inspectionId) {
      this.mutilservice.popToastView('请先开始巡检');
      return;
    }
    if (objGroup.value.groupType === 'pic') {
      this.groupId = objGroup.value.groupId;
      this.getPosition().then((data: any) => {
        this.uploadPicParams = {
          inspectionId: this.inspectionId,
          objGroup: this.groupId,
          latitude: +data.latitude,
          longitude: +data.longitude,
        };
        this.chooseType(index);
      });
    } else {
      this.canLeave = true;
      this.groupId = objGroup.value.groupId;
      this.navCtrl.push(EquipmentListPage, {
        stationId: this.form.value.stationId,
        deviceType: objGroup.value.deviceType,
        isSingle: true,
        isTracking: this.isTracking,
      });
    }
  }

  editObj(objId) {
    this.inspectionsprovider.getObj({ objId }).subscribe((res) => {
      this.canLeave = true;
      this.navCtrl.push(InspectionDevicePage, {
        objInfo: { ...res },
        isTracking: true,
        objPermission: this.objPermission,
      });
    });
  }

  chooseType(index) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.takePhoto(index);
          },
        },
        {
          text: '从相册选择',
          handler: () => {
            this.upload(index);
          },
        },
        {
          text: '取消',
          handler: () => {
            console.log('cancel');
          },
        },
      ],
      cssClass: 'commonSheet',
    });

    actionSheet.present().then((value) => {
      return value;
    });
  }

  takePhoto(index) {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: false,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: false,
    };

    this.camera.getPicture(options).then(
      (image) => {
        this.pluginservice
          .uploadPic(
            image,
            '/api/m/v2/inspections/pic',
            'file',
            this.uploadPicParams
          )
          .then((res: any) => {
            this.savePic(res.data, index);
          });
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  upload(index) {
    // if (this.platform.is('android')) {
    this.imagePicker
      .getPictures({ maximumImagesCount: 1, width: 200, height: 200 })
      .then(
        (results) => {
          this.pluginservice
            .uploadPic(
              results[0],
              '/api/m/v2/inspections/pic',
              'file',
              this.uploadPicParams
            )
            .then((res: any) => {
              this.savePic(res.data, index);
            });
        },
        (err) => { }
      );
    // } else {
    //   this.filePicker
    //     .pickFile()
    //     .then((uri) => {
    //       this.pluginservice
    //         .uploadPic(
    //           uri,
    //           '/api/m/v2/inspections/pic',
    //           'file',
    //           this.uploadPicParams
    //         )
    //         .then((res: any) => {
    //           this.savePic(res, index);
    //         });
    //     })
    //     .catch((err) => console.log('Error', err));
    // }
  }

  savePic(data, index) {
    const objGroupscontrol = this.form.get('objGroups') as FormArray;
    const control = objGroupscontrol.controls[index].get('objs') as FormArray;
    const objItems = this.form.value.objGroups[index].objs || [];
    objItems.push(data);
    while (control.length) {
      control.removeAt(control.length - 1);
    }
    objItems.map(() => {
      control.push(this.initObj());
    });
    control.patchValue(objItems);
    this.mutilservice.popToastView('上传成功');
  }

  deletePic(objId, index) {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定要删除该项吗？',
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
            this.inspectionsprovider.deleteObj(objId).subscribe((res) => {
              const objGroupscontrol = this.form.get('objGroups') as FormArray;
              const control = objGroupscontrol.controls[index].get(
                'objs'
              ) as FormArray;
              const objItems = this.form.value.objGroups[index].objs || [];
              _.remove(objItems, (o) => {
                return o.objId === objId;
              });
              while (control.length) {
                control.removeAt(control.length - 1);
              }
              objItems.map(() => {
                control.push(this.initObj());
              });
              control.patchValue(objItems);
              this.mutilservice.popToastView('删除成功');
            });
          },
        },
      ],
    });
    confirm.present();
  }

  viewPic(url) {
    this.photoViewer.show(url);
  }

  initNodes() {
    return new FormGroup({
      statusText: new FormControl(null),
      name: new FormControl(null),
      nodeType: new FormControl(null),
      user: new FormControl(null),
      status: new FormControl(null),
    });
  }

  initLinks() {
    return new FormGroup({
      sourceId: new FormControl(null),
      targetId: new FormControl(null),
      source: new FormControl(null),
      target: new FormControl(null),
    });
  }

  initWorkflowLogs() {
    return new FormGroup({
      logId: new FormControl(null),
      action: new FormControl(null),
      executeTime: new FormControl(null),
      flowId: new FormControl(null),
      memo: new FormControl(null),
      nextNodeId: new FormControl(null),
      nextNodeName: new FormControl(null),
      nodeId: new FormControl(null),
      orderId: new FormControl(null),
      preNodeId: new FormControl(null),
      preNodeName: new FormControl(null),
      userId: new FormControl(null),
      userName: new FormControl(null),
    });
  }

  getWorkflowLogs(form) {
    return form.controls.workflowLogs.controls;
  }

  formatISOTime() {
    if (this.form.value.planStartTime) {
      if (this.form.value.planStartTime.indexOf('Z') != -1) {
        this.form.patchValue({
          planStartTime: moment(
            this.form.value.planStartTime.substr(
              0,
              this.form.value.planStartTime.length - 1
            )
          ).format(),
        });
      }
    }
    if (this.form.value.planEndTime) {
      if (this.form.value.planEndTime.indexOf('Z') != -1) {
        this.form.patchValue({
          planEndTime: moment(
            this.form.value.planEndTime.substr(
              0,
              this.form.value.planEndTime.length - 1
            )
          ).format(),
        });
      }
    }
    if (this.form.value.planStartTime && this.form.value.planEndTime) {
      if (
        moment(this.form.value.planEndTime).valueOf() -
        moment(this.form.value.planStartTime).valueOf() <
        0
      ) {
        this.mutilservice.popToastView('计划开始时间要小于计划结束时间！');
        this.form.patchValue({
          planEndTime: null,
        });
        return false;
      }
    }
    if (this.form.value.startTime) {
      if (this.form.value.startTime.indexOf('Z') != -1) {
        this.form.patchValue({
          startTime: moment(
            this.form.value.startTime.substr(
              0,
              this.form.value.startTime.length - 1
            )
          ).format(),
        });
      }
    }
    if (this.form.value.endTime) {
      if (this.form.value.endTime.indexOf('Z') != -1) {
        this.form.patchValue({
          endTime: moment(
            this.form.value.endTime.substr(
              0,
              this.form.value.endTime.length - 1
            )
          ).format(),
        });
      }
    }
    if (this.form.value.startTime && this.form.value.endTime) {
      if (
        moment(this.form.value.endTime).valueOf() -
        moment(this.form.value.startTime).valueOf() <
        0
      ) {
        this.mutilservice.popToastView('实际结束时间要大于实际开始时间！');
        this.form.patchValue({
          endTime: null,
        });
        return false;
      }
    }
    return true;
  }

  changeDate(start, end) {
    const values = this.form.value;
    if (values[start] && values[end]) {
      if (moment(values[end]).valueOf() - moment(values[start]).valueOf() < 0) {
        this.mutilservice.popToastView(
          `${this.fields[end].name}要大于${this.fields[start].name}`
        );
        return;
      }
    }
  }
}
