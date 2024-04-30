import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  AlertController,
  Platform,
} from 'ionic-angular';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { DefesService } from '../../../providers/defes.servicer';
import { MutilService } from '../../../providers/util/Mutil.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PluginService } from '../../../providers/util/plugin.service';
import { ImagePicker } from '@ionic-native/image-picker';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { APP_CONFIG, AppConfig } from '../../../models/app-config';
import { MaintainsDevicePage } from './maintains-device/maintains-device';
import * as _ from 'lodash';
import * as moment from 'moment';
import { buildWorkFlow } from './work-flow.chart';
import { CommonStationPage } from '../../util/common-station/common-station';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonInputPage } from '../../util/modal/common-input/common-input';
import { CommonTextareaPage } from '../../util/modal/common-textarea/common-textarea';
import { CommonDispatchPage } from '../../util/modal/common-dispatch/common-dispatch';
import { CommonCheckPage } from '../../util/modal/common-check/common-check';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';
import { MaintainsProvider } from '../../../providers/maintains.service';
/**
 * Generated class for the MaintainsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-maintains-details',
  templateUrl: 'maintains-details.html',
})
export class MaintainsDetailsPage {
  @ViewChild('echart') echart;
  title: string;
  form: FormGroup;
  inspectionId: any;
  inspectionType: any;
  fields: any;
  buttons: any = [];

  toggleBaseInfo = true;
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

  trackInterval: number;
  objToggle = [];
  uploadPicParams: {};
  groupId: any;
  fileBasePath: string;
  nodes: any;
  links: any;
  options: any;
  objGroups: any[];
  map: any;
  objPermission: any = 2;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private maintainsprovider: MaintainsProvider,
    private defesservice: DefesService,
    private alertCtrl: AlertController,
    private mutilservice: MutilService,
    private camera: Camera,
    private pluginservice: PluginService,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private filePicker: IOSFilePicker,
    private photoViewer: PhotoViewer,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
  ) {
    this.initForm();
    this.fileBasePath = this.appConfig.fileEndpoint;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionsDetailsPage');
    this.inspectionId = this.navParams.get('inspectionId') || 0;
    this.inspectionType = this.navParams.get('inspectionType');
    this.getMaintainsDetails();
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
      this.maintainsprovider.getObj(params).subscribe((res) => {
        this.navCtrl.push(MaintainsDevicePage, {
          objInfo: {
            ...res,
            inspectionId: this.inspectionId,
            stationId: equipment.stationId,
            stationName: equipment.stationName,
          },
          objPermission: this.objPermission,
        });
      });
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
              _.indexOf(objGroupValue[index].objs, (o) => {
                return o.objId === data.objId;
              }),
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

  getMaintainsDetails() {
    this.maintainsprovider
      .getMaintainsDetails(this.inspectionId, { inspectionType: this.inspectionType })
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
    values.endTime = _.isNumber(values.endTime) ? moment(values.endTime).format() : values.endTime;

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
            const control = (this.form.get('workflow') as FormGroup).controls[key] as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            element.map((item) => {
              control.push(this.initNodes());
            });
          } else if (key === 'links') {
            this.links = element;
            const control = (this.form.get('workflow') as FormGroup).controls[key] as FormArray;
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
      },
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
      },
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
      },
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
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
          this.maintainsprovider.maintainsAction(params).subscribe((res) => {
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
      this.maintainsprovider.maintainsUpdateAction(params).subscribe((res) => {
        this.fillValue(res);
        // this.mutilservice.popToastView('巡检开始');
      });
    } else {
      this.form.patchValue({
        startTime: moment().format(),
      });
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
      this.maintainsprovider.maintainsAction(params).subscribe((res) => {
        this.fillValue(res);
      });
    }
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
      },
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
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
          this.maintainsprovider.maintainsUpdateAction(params).subscribe((res) => {
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
      message: '确定检修/预试已完成么？完成后将无法再增加或修改检修/预试内容',
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
            this.maintainsprovider.maintainsAction(params).subscribe((res) => {
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
      },
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          let params = {
            inspectionId: this.inspectionId,
            checkStatus: data.value.checkStatus,
            checkMemo: data.value.checkMemo,
          };
          this.maintainsprovider.check(params).subscribe((res: any) => {
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
      message: '确定要删除该检修/预试单吗?',
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
            this.maintainsprovider.check(inspectionId).subscribe((res) => {
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
    this.maintainsprovider.remind(this.inspectionId).subscribe((res) => {
      this.mutilservice.popToastView('已发送催单消息');
    });
  }

  showMoreButtons() {
    this.buttonToggle = !this.buttonToggle;
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
      this.mutilservice.popToastView('请先点击开始按钮');
      return;
    }
    if (objGroup.value.groupType === 'pic') {
      this.groupId = objGroup.value.groupId;
      this.uploadPicParams = {
        inspectionId: this.inspectionId,
        objGroup: this.groupId,
      };
      this.chooseType(index);
    } else {
      this.groupId = objGroup.value.groupId;
      this.navCtrl.push(EquipmentListPage, {
        stationId: this.form.value.stationId,
        deviceType: objGroup.value.deviceType,
        isSingle: true,
      });
    }
  }

  editObj(objId) {
    this.maintainsprovider.getObj({ objId }).subscribe((res) => {
      this.navCtrl.push(MaintainsDevicePage, {
        objInfo: {
          ...res,
          inspectionId: this.inspectionId,
          stationId: this.form.value.stationId,
          stationName: this.form.value.stationName,
        },
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
          .uploadPic(image, '/api/m/v2/inspections/pic', 'file', this.uploadPicParams)
          .then((res: any) => {
            this.savePic(res.data, index);
          });
      },
      (error) => {
        console.log('Error: ' + error);
      },
    );
  }

  upload(index) {
    // if (this.platform.is('android')) {
    this.imagePicker.getPictures({ maximumImagesCount: 1, width: 200, height: 200 }).then(
      (results) => {
        this.pluginservice
          .uploadPic(results[0], '/api/m/v2/inspections/pic', 'file', this.uploadPicParams)
          .then((res: any) => {
            this.savePic(res.data, index);
          });
      },
      (err) => { },
    );
    // } else {
    //   this.filePicker
    //     .pickFile()
    //     .then((uri) => {
    //       this.pluginservice
    //         .uploadPic(uri, '/api/m/v2/inspections/pic', 'file', this.uploadPicParams)
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
            this.maintainsprovider.deleteObj(objId).subscribe((res) => {
              const objGroupscontrol = this.form.get('objGroups') as FormArray;
              const control = objGroupscontrol.controls[index].get('objs') as FormArray;
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
}
