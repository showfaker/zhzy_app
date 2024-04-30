import { WorkTicket1Page } from '../work-ticket1/work-ticket1';
import { MutilService } from '../../../providers/util/Mutil.service';
import { ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { CommonInputPage } from '../../util/modal/common-input/common-input';
import { ModalController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonTextareaPage } from '../../util/modal/common-textarea/common-textarea';
import * as moment from 'moment';
import { DefesService } from '../../../providers/defes.servicer';
import { CommonStationPage } from '../../util/common-station/common-station';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';
import { buildWorkFlow } from './work-flow.chart';
import { CommonCheckPage } from '../../util/modal/common-check/common-check';
import { WorkTicket2Page } from '../work-ticket2/work-ticket2';
import { InventorisOutInPage } from '../inventoris/inventoris-out-in/inventoris-out-in';
import { CommonDispatchPage } from '../../util/modal/common-dispatch/common-dispatch';
import { RepairTicketDetailsPage } from '../repair-ticket-details/repair-ticket-details';
import { OperateTicketsDetailsPage } from '../operate-tickets-details/operate-tickets-details';
import { DefectDevicesPage } from '../../util/modal/defect-devices/defect-devices';
/**
 * Generated class for the JobRecordDetailsPage page.
 * 缺陷单
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-defect-management-details',
  templateUrl: 'defect-management-details.html',
})
export class DefectManagementDetailsPage {
  @ViewChild('echart') echart;
  toggleBaseInfo = true;
  toggleProcess = false;
  toggleProcessResult = false;

  toggleDefectInspection = false;
  toggleWorkFlow = false;
  toggleWorkflowLogs = false;
  toggleComment = false;
  buttonToggle = false;

  form: FormGroup;
  title: any;
  fields: any;
  stationId: any;
  buttons: any = [];
  defectId: any;
  nodes: any;
  links: any;
  options: any;
  workflowLogs: any;
  commentsList: any = [];
  ccUsers: any = [];
  orderId: any = null;
  picPermission: any;
  docPermission: any;
  ccPermission: any;
  commentPermission: any;
  freshPage: any;
  alarmInfo: any = null;
  deviceId: any;
  parentOrderId: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private mutilservice: MutilService,
    private defesservice: DefesService,
  ) {
    this.initForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobRecordDetailsPage');
    this.defectId = this.navParams.get('defectId') ? this.navParams.get('defectId') : 0;
    this.deviceId = this.navParams.get('deviceId') ? this.navParams.get('deviceId') : null;
    this.parentOrderId = this.navParams.get('parentOrderId')
      ? this.navParams.get('parentOrderId')
      : null;
    this.alarmInfo = this.navParams.get('alarmInfo');
    this.getDefectManagementDetail();
  }

  ionViewWillEnter() {
    this.freshPage = this.navParams.get('freshPage');
    if (this.freshPage) {
      this.freshPage = false;
      this.getDefectManagementDetail();
    }
  }

  getDefectManagementDetail() {
    const loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });

    loading.present();
    this.defesservice
      .getDefectDetail(this.defectId, { deviceId: this.deviceId })
      .subscribe((res) => {
        loading.dismiss();
        if (res) {
          // 页面标题
          this.title = res.title;
          // 字段描述
          this.fields = res.fields || [];
          // 操作按钮
          this.buttons = res.buttons || [];
          // 页面显示值
          const values = res.defect;
          if (this.alarmInfo) {
            values.alarmLogId = this.alarmInfo.alarmLogId;
            values.stationName = this.alarmInfo.stationName;
            values.stationId = this.alarmInfo.stationId;
            values.defectSource = this.alarmInfo.defectSource;
            values.defectSourceText = this.alarmInfo.defectSourceText;
            values.defectDevices = this.alarmInfo.defectDevices;
          }
          if (this.parentOrderId) {
            values.parentOrderId = this.parentOrderId;
          }
          // 图片权限
          this.picPermission = res.picPermission;
          // 文档权限
          this.docPermission = res.docPermission;
          // 抄送权限
          this.ccPermission = res.ccPermission;
          // 评论权限
          this.commentPermission = res.commentPermission;

          this.orderId = values.orderId;

          // 处理发现时间
          values.reportTime = _.isNumber(values.reportTime)
            ? moment(values.reportTime).format()
            : values.reportTime;
          // 处理缺陷发生时间
          values.originTime = _.isNumber(values.originTime)
            ? moment(values.originTime).format()
            : values.originTime;

          // 处理缺陷设备
          if (values.defectDevices !== null) {
            const control = this.form.get('defectDevices') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            values.defectDevices.map((item) => {
              control.push(this.initDevice());
            });
          } else {
            values.defectDevices = [];
          }

          // 处理过程
          // 抢修单
          if (values.repairTickets !== null) {
            let control = this.form.get('repairTickets') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            values.repairTickets.map((item) => {
              control.push(this.initRepairTickets());
            });
          } else {
            values.repairTickets = [];
          }
          // 工作票
          if (values.workTickets !== null) {
            let control = this.form.get('workTickets') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            values.workTickets.map((item) => {
              control.push(this.initWorkTickets());
            });
          } else {
            values.workTickets = [];
          }
          // 操作票
          if (values.operationTickets !== null) {
            let control = this.form.get('operationTickets') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            values.operationTickets.map((item) => {
              control.push(this.initOperationTickets());
            });
          } else {
            values.operationTickets = [];
          }
          // 备品备件
          if (values.materials !== null) {
            let control = this.form.get('materials') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            values.materials.map((item) => {
              control.push(this.initMaterials());
            });
          } else {
            values.materials = [];
          }

          // 处理参与人
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

          // 开始处理时间
          values.startTime = _.isNumber(values.startTime)
            ? moment(values.startTime).format()
            : values.startTime;

          // 处理完成时间
          values.endTime = _.isNumber(values.endTime)
            ? moment(values.endTime).format()
            : values.endTime;

          // 照片
          if (values.pics !== null) {
            const control = this.form.get('pics') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            values.pics.map((item) => {
              control.push(this.initDoc());
            });
          } else {
            values.pics = [];
          }

          // 文件
          if (values.docs !== null) {
            const control = this.form.get('docs') as FormArray;
            while (control.length) {
              control.removeAt(control.length - 1);
            }
            values.docs.map((item) => {
              control.push(this.initDoc());
            });
          } else {
            values.docs = [];
          }

          // 检查时间
          values.checkTime = _.isNumber(values.checkTime)
            ? moment(values.checkTime).format('YYYY-MM-DD HH:mm')
            : values.checkTime;

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
          this.form.patchValue(values);
        }
      });
  }

  initForm() {
    this.form = this.fb.group({
      defectId: new FormControl(null),
      defectCode: new FormControl(null),
      orderId: new FormControl(null),
      nodeId: new FormControl(null),
      alarmLogId: new FormControl(null),
      parentOrderId: new FormControl(null),
      //基本信息
      stationId: new FormControl(null),
      stationName: new FormControl(null),
      reporter: new FormControl(null),
      reporterName: new FormControl(null),
      reportTime: new FormControl(null),
      defectType: new FormControl(null),
      defectTypeText: new FormControl(null),
      originTime: new FormControl(null),
      defectSource: new FormControl(null),
      defectSourceText: new FormControl(null),
      defectLevel: new FormControl(null),
      defectLevelText: new FormControl(null),
      defectDesc: new FormControl(null),
      defectDevices: this.fb.array([]),

      // 处理过程
      repairTickets: this.fb.array([]),
      workTickets: this.fb.array([]),
      operationTickets: this.fb.array([]),
      materials: this.fb.array([]),

      // 处理结果
      responsiblePerson: new FormControl(null),
      responsiblePersonName: new FormControl(null),
      players: this.fb.array([]),
      playersText: new FormControl(''),
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      workHours: new FormControl(null),
      lossEnergy: new FormControl(null),
      defectCost: new FormControl(null),
      defectStatus: new FormControl(null),
      defectStatusText: new FormControl(null),
      resultDesc: new FormControl(null),

      // 照片
      pics: this.fb.array([]),
      // 文件
      docs: this.fb.array([]),

      // 缺陷检查
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

  openInputModal(type, editable) {
    if (!editable) {
      return;
    }
    const modal = this.modalCtrl.create(
      CommonInputPage,
      {
        value: this.form.value[type],
        title: this.fields[type]['name'],
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
              if (
                this.form.value[aNewKey[0]] &&
                this.form.value[aNewKey[0]].length > 0 &&
                !element
              ) {
                let flag = true;
                this.form.value[aNewKey[0]].every((item) => {
                  console.log(flag);
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

  switchFunction(button) {
    switch (button.buttonAction) {
      case '$remind$':
        this.remindFunction(this.defectId);
        break;
      case '$check$':
        this.checkFunction();
        break;
      case 'repairTicket':
        this.repairTicketFunction(button);
        break;
      case 'rejectRepair':
        this.rejectRepairFunction(button);
        break;
      case 'finishRepair':
        this.finishRepairFunction(button);
        break;
      case 'workTicket1':
        this.workTicket1Function(button.buttonId);
        break;
      case 'workTicket2':
        this.workTicket2Function(button.buttonId);
        break;
      case 'materialOut':
        this.materialOutFunction();
        break;
      case 'materialIn':
        this.materialInFunction();
        break;
      case 'dispatch':
        this.dispatchFunction(button);
        break;
      case '$save$':
        this.actionFunction(button);
        break;
      case 'reject':
        this.actionFunction(button);
        break;
      case 'close':
        this.actionFunction(button);
        break;
      case 'finish':
        this.finishFunction(button);
        break;
      case 'delete':
        this.deleteFunction();
        break;
      default:
        break;
    }
  }

  // 催单操作
  remindFunction(defectId) {
    this.defesservice.remind(defectId).subscribe((res) => {
      this.mutilservice.popToastView('已发送催单消息');
    });
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
          console.log(data);
          let params = {
            defectId: this.defectId,
            checkStatus: data.value.checkStatus,
            checkMemo: data.value.checkMemo,
          };
          this.defesservice.check(params).subscribe((res: any) => {
            this.mutilservice.popToastView('提交成功');
            this.form.patchValue(res);
          });
        }
      }
    });
    modal.present();
  }

  // 抢修单
  repairTicketFunction(button) {
    this.formatISOTime();
    let params = {
      title: this.title,
      defect: this.form.value,
      action: button,
      nextUserIds: null,
      memo: null,
    };
    this.defesservice.defectAction(params).subscribe((res) => {
      this.mutilservice.popToastView('提交成功');
      this.navCtrl.push(RepairTicketDetailsPage, {
        parentOrderId: this.form.value.orderId,
        pageInfo: {
          stationId: this.form.value.stationId,
          stationName: this.form.value.stationName,
        },
      });
    });
  }

  // 抢修单 回退
  rejectRepairFunction(button) {
    if (this.form.value.repairTickets.length !== 0) {
      this.mutilservice.customPrompt({ msg: '回退将删除已创建的抢修单，确定要回退么？' }, () => {
        this.formatISOTime();
        let params = {
          title: this.title,
          defect: this.form.value,
          action: button,
          nextUserIds: null,
          memo: null,
        };
        this.defesservice.defectAction(params).subscribe((res) => {
          this.mutilservice.popToastView('提交成功');
          this.navCtrl.getPrevious().data.freshPage = true;
          this.navCtrl.pop();
        });
      });
    } else {
      this.formatISOTime();
      let params = {
        title: this.title,
        defect: this.form.value,
        action: button,
        nextUserIds: null,
        memo: null,
      };
      this.defesservice.defectAction(params).subscribe((res) => {
        this.mutilservice.popToastView('提交成功');
        this.navCtrl.getPrevious().data.freshPage = true;
        this.navCtrl.pop();
      });
    }
  }

  // 抢修单 完成
  finishRepairFunction(button) {
    if (this.form.value.repairTickets.length !== 0) {
      this.formatISOTime();
      let params = {
        title: this.title,
        defect: this.form.value,
        action: button,
        nextUserIds: null,
        memo: null,
      };
      this.defesservice.defectAction(params).subscribe((res) => {
        this.mutilservice.popToastView('提交成功');
        this.navCtrl.getPrevious().data.freshPage = true;
        this.navCtrl.pop();
      });
    } else {
      this.navCtrl.push(RepairTicketDetailsPage, {
        pageInfo: {
          stationId: this.form.value.stationId,
          stationName: this.form.value.stationName,
        },
      });
    }
  }

  // 一种工作票
  workTicket1Function(buttonId) {
    this.navCtrl.push(WorkTicket1Page, {
      parentId: this.form.value.orderId,
      parentButtonId: buttonId,
    });
  }

  // 二种工作票
  workTicket2Function(buttonId) {
    this.navCtrl.push(WorkTicket2Page, {
      parentId: this.form.value.orderId,
      parentButtonId: buttonId,
    });
  }

  // 出库
  materialOutFunction() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));
    this.navCtrl.push(InventorisOutInPage, {
      type: 'out',
      relaBusinessTypeText: '抢修单号',
      value: {
        relaBusinessId: this.form.value.orderId,
        relaBusinessCode: this.form.value.defectCode,
        ioOperator: user.userId,
        ioTime: moment().format(),
        ioOperatorName: user.realName,
      },
    });
  }

  // 入库
  materialInFunction() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));
    this.navCtrl.push(InventorisOutInPage, {
      type: 'in',
      relaBusinessTypeText: '抢修单号',
      value: {
        relaBusinessId: this.form.value.orderId,
        relaBusinessCode: this.form.value.defectCode,
        ioOperator: user.userId,
        ioTime: moment().format(),
        ioOperatorName: user.realName,
      },
    });
  }

  // 派单/转派
  dispatchFunction(button) {
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
          this.formatISOTime();
          let params = {
            title: this.title,
            defect: this.form.value,
            action: button,
            nextUserIds: data.value.nextUserIds,
            memo: data.value.memo,
          };
          this.defesservice.defectAction(params).subscribe((res) => {
            this.mutilservice.popToastView('提交成功');
            this.navCtrl.getPrevious().data.freshPage = true;
            this.navCtrl.pop();
          });
        }
      }
    });
    modal.present();
  }

  // 驳回/关闭/完成/保存
  actionFunction(button) {
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
          this.formatISOTime();
          let params = {
            title: this.title,
            defect: this.form.value,
            action: button,
            nextUserIds: null,
            memo: data.value,
          };
          this.defesservice.defectAction(params).subscribe((res) => {
            this.mutilservice.popToastView('提交成功');
            this.navCtrl.getPrevious().data.freshPage = true;
            this.navCtrl.pop();
          });
        }
      }
    });
    modal.present();
  }

  // 完成
  finishFunction(button) {
    this.mutilservice.customPrompt({ msg: '你确定提交吗?' }, () => {
      this.formatISOTime();
      let params = {
        title: this.title,
        defect: this.form.value,
        action: button,
        nextUserIds: null,
        memo: null,
      };
      this.defesservice.defectAction(params).subscribe((res) => {
        this.mutilservice.popToastView('提交成功');
        this.navCtrl.getPrevious().data.freshPage = true;
        this.navCtrl.pop();
      });
    });
  }

  // 删除
  deleteFunction() {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定要删除该缺陷单么?',
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
            const defectId = this.form.value.defectId;
            this.defesservice.defectActionDelete(defectId).subscribe((res) => {
              this.mutilservice.popToastView('删除成功');
              this.navCtrl.pop();
            });
          },
        },
      ],
    });
    confirm.present();
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

  // 选择发现人
  selectUser() {
    const value = this.form.value;
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: true,
      selectedItem: [{ userId: value.reporter, userName: value.reporterName }],
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.form.patchValue({
            reporter: data.value[0] ? data.value[0].userId : null,
            reporterName: data.value[0] ? data.value[0].realName : null,
          });
        } else {
          this.form.patchValue({
            reporter: null,
            reporterName: null,
          });
        }
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

  //选择设备
  selectEquipment(editable) {
    if (!this.form.value.stationId) {
      this.mutilservice.popToastView('请先选择电站');
      return;
    }
    const selectedItem = [];
    if (this.form.value.defectDevices !== null) {
      this.form.value.defectDevices.map((item) => {
        selectedItem.push({
          deviceId: item.objId,
          displayName: item.objName,
          psrId: item.psrId,
          objType: item.deviceType,
        });
      });
    }
    this.navCtrl.push(EquipmentListPage, {
      stationId: this.form.value.stationId,
      isSingle: false,
      editable,
      selectedItem: selectedItem,
    });
  }

  operateDefectDevices(type, editable, index?) {
    if (!editable) {
      return;
    }
    if (!this.form.value.stationId) {
      this.mutilservice.popToastView('请先选择电站');
      return;
    }
    const modal = this.modalCtrl.create(
      DefectDevicesPage,
      {
        stationId: this.form.value.stationId,
        value: type === 'edit' ? this.form.value.defectDevices[index] : null,
      },
      {
        cssClass: 'commonModal defectDevicesModal',
        showBackdrop: true,
        enableBackdropDismiss: false,
      },
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok' && type === 'add' && editable) {
          const defectDevices = this.form.value.defectDevices;
          const control = this.form.get('defectDevices') as FormArray;
          while (control.length) {
            control.removeAt(control.length - 1);
          }
          defectDevices.push(data.value);
          defectDevices.map((item) => {
            control.push(this.initDevice());
          });
          this.form.get('defectDevices').patchValue(defectDevices);
        } else if (data.type === 'ok' && type === 'edit') {
          const control = this.form.get('defectDevices') as FormArray;
          control.controls[index].setValue(data.value);
        }
      }
    });
    modal.present();
  }

  deleteDefectDevices(index, editable) {
    if (!editable) {
      return;
    }
    const control = this.form.get('defectDevices') as FormArray;
    control.removeAt(index);
  }

  public getDevices(form) {
    return form.controls.defectDevices.controls;
  }

  // 初始化 缺陷设备form
  initDevice() {
    return new FormGroup({
      objNo: new FormControl(null),
      objId: new FormControl(null),
      deviceNo: new FormControl(null),
      objName: new FormControl(null),
      psrId: new FormControl(null),
      objCompany: new FormControl(null),
      objProvider: new FormControl(null),
      objClass: new FormControl(null),
      objClassName: new FormControl(null),
      workHours: new FormControl(null),
      lossEnergy: new FormControl(null),
      objCost: new FormControl(null),
    });
  }

  getRepairTickets(form) {
    return form.controls.repairTickets.controls;
  }

  // 初始化抢修单
  initRepairTickets() {
    return new FormGroup({
      orderId: new FormControl(null),
      orderCode: new FormControl(null),
    });
  }

  getWorkTickets(form) {
    return form.controls.workTickets.controls;
  }
  // 初始化工作票
  initWorkTickets() {
    return new FormGroup({
      orderId: new FormControl(null),
      orderCode: new FormControl(null),
    });
  }

  getOperationTickets(form) {
    return form.controls.operationTickets.controls;
  }

  // 初始化操作票
  initOperationTickets() {
    return new FormGroup({
      orderId: new FormControl(null),
      orderCode: new FormControl(null),
    });
  }

  getMaterials(form) {
    return form.controls.materials.controls;
  }

  // 初始化备品备件
  initMaterials() {
    return new FormGroup({
      detailId: new FormControl(null),
      materialName: new FormControl(null),
    });
  }

  // 选择负责人
  selectResponsiblePerson() {
    const value = this.form.value;
    const modal = this.modalCtrl.create(CommonUserPage, {
      isSingle: true,
      selectedItem: [
        {
          userId: value.responsiblePerson,
          userName: value.responsiblePersonName,
        },
      ],
    });
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type == 'ok') {
          this.form.patchValue({
            responsiblePerson: data.value[0] ? data.value[0].userId : null,
            responsiblePersonName: data.value[0] ? data.value[0].realName : null,
          });
        } else {
          this.form.patchValue({
            responsiblePerson: null,
            responsiblePersonName: null,
          });
        }
      }
    });
    modal.present();
  }

  // 参与人
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

  setPics(data) {
    const value = this.form.value.pics || [];
    const control = this.form.get('pics') as FormArray;
    while (control.length) {
      control.removeAt(control.length - 1);
    }
    data.map((item) => {
      control.push(this.initDoc());
      value.push(item);
    });
    this.form.get('pics').patchValue(value);
  }

  initDoc() {
    return new FormGroup({
      docId: new FormControl(null),
      docName: new FormControl(null),
      docType: new FormControl(null),
      folderId: new FormControl(null),
      size: new FormControl(null),
      sizeDesc: new FormControl(null),
      memo: new FormControl(null),
      orderNo: new FormControl(null),
      customerId: new FormControl(null),
      uri: new FormControl(null),
      updateTime: new FormControl(null),
      updater: new FormControl(null),
      stationId: new FormControl(null),
      realName: new FormControl(null),
      stationName: new FormControl(null),
      recordType: new FormControl(null),
      recordId: new FormControl(null),
      updaterName: new FormControl(null),
    });
  }

  setDocs(data) {
    console.log(data);
    const value = this.form.value.docs || [];
    const control = this.form.get('docs') as FormArray;
    while (control.length) {
      control.removeAt(control.length - 1);
    }
    data.map((item) => {
      control.push(this.initDoc());
      value.push(item);
    });
    this.form.get('docs').patchValue(value);
    console.log(this.form.value.docs);
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

  getWorkflowLogs(form) {
    return form.controls.workflowLogs.controls;
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

  showMoreButtons() {
    this.buttonToggle = !this.buttonToggle;
  }

  viewMaterial(detailId) {
    this.navCtrl.push(InventorisOutInPage, {
      view: true,
      detailId,
    });
  }

  viewRepairTicket(orderId) {
    this.navCtrl.push(RepairTicketDetailsPage, {
      view: true,
      ticketId: orderId,
    });
  }

  viewOperateTicket(orderId) {
    this.navCtrl.push(OperateTicketsDetailsPage, {
      view: true,
      ticketId: orderId,
    });
  }

  formatISOTime() {
    if (this.form.value.startTime) {
      if (this.form.value.startTime.indexOf('Z') != -1) {
        this.form.patchValue({
          startTime: moment(
            this.form.value.startTime.substr(0, this.form.value.startTime.length - 1),
          ).format(),
        });
      }
    }
    if (this.form.value.endTime) {
      if (this.form.value.endTime.indexOf('Z') != -1) {
        this.form.patchValue({
          endTime: moment(
            this.form.value.endTime.substr(0, this.form.value.endTime.length - 1),
          ).format(),
        });
      }
    }
    if (this.form.value.startTime && this.form.value.endTime) {
      if (
        moment(this.form.value.endTime).valueOf() - moment(this.form.value.startTime).valueOf() <
        0
      ) {
        this.mutilservice.popToastView('开始处理时间要小于处理完成时间！');
        this.form.patchValue({
          startTime: null,
        });
        return;
      }
    }
  }
}
