import { RepairTicketDetailsPage } from './../repair-ticket-details/repair-ticket-details';
import { DefectManagementDetailsPage } from './../defect-management-details/defect-management-details';
import { MutilService } from './../../../providers/util/Mutil.service';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { OperateTicketsProvider } from './../../../providers/operate-tickets.service';
import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  AlertController,
} from 'ionic-angular';
import { CommonStationPage } from '../../util/common-station/common-station';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonTextareaPage } from '../../util/modal/common-textarea/common-textarea';
import { CommonOperateStepPage } from '../../util/modal/common-operate-step/common-operate-step';
import moment from 'moment';
import { CommonTypicalOperateTicketsPage } from '../../util/common-typical-operate-tickets/common-typical-operate-tickets';
import * as _ from 'lodash';
import { CommonCheckPage } from '../../util/modal/common-check/common-check';

/**
 * Generated class for the OperateTicketsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-operate-tickets-details',
  templateUrl: 'operate-tickets-details.html',
})
export class OperateTicketsDetailsPage {
  ticketId: any;
  title: any;
  buttons: any = [];
  fields: any;
  picPermission: any;
  docPermission: any;
  ccPermission: any;
  commentPermission: any;

  toggleBaseInfo = true;
  toggleOperateSteps = false;
  toggleOperateInspection = false;
  toggleComment = false;
  buttonToggle = false;
  form: any;
  orderId: any;
  nodes: any;
  links: any;
  options: any;
  ccUsers: any = [];
  commentsList: any = [];
  tasks: any = [];
  view: any;
  loadTemplate: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private operateticketsservice: OperateTicketsProvider,
    private alertCtrl: AlertController,
    private mutilservice: MutilService
  ) {
    this.initForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OperateTicketsDetailsPage');
    this.ticketId = this.navParams.get('ticketId')
      ? this.navParams.get('ticketId')
      : 0;
    this.view = this.navParams.get('view');
    this.getOperateTicketsDetails();
  }

  initForm() {
    this.form = this.fb.group({
      ticketId: new FormControl(null),
      ticketCode: new FormControl(null),
      orderId: new FormControl(null),
      parentOrderId: new FormControl(null),
      parentOrderCode: new FormControl(null),
      parentOrderType: new FormControl(null),
      parentOrderTypeText: new FormControl(null),
      customerId: new FormControl(null),
      stationId: new FormControl(null),
      stationName: new FormControl(null),
      operateType: new FormControl(null),
      operateTypeText: new FormControl(null),
      sender: new FormControl(null),
      senderName: new FormControl(null),
      receiver: new FormControl(null),
      receiverName: new FormControl(null),
      orderTime: new FormControl(null),
      operateDesc: new FormControl(null),
      auditor: new FormControl(null),
      auditorName: new FormControl(null),
      ticketLeader: new FormControl(null),
      ticketLeaderName: new FormControl(null),
      executer: new FormControl(null),
      executerName: new FormControl(null),
      supervisior: new FormControl(null),
      supervisiorName: new FormControl(null),

      // 操作步骤
      tasks: this.fb.array([]),
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      memo: new FormControl(null),
      creater: new FormControl(null),
      createrName: new FormControl(null),
      createTime: new FormControl(null),

      // 照片
      pics: this.fb.array([]),
      // 文件
      docs: this.fb.array([]),

      // 抢修单检查
      checkStatus: new FormControl(null),
      checkStatusText: new FormControl(null),
      checker: new FormControl(null),
      checkerName: new FormControl(null),
      checkTime: new FormControl(null),
      checkMemo: new FormControl(null),

      //抄送
      ccUsers: this.fb.array([]),
    });
  }

  getTask(form) {
    return form.controls.tasks.controls;
  }

  initTasks() {
    return new FormGroup({
      taskId: new FormControl(null),
      ticketId: new FormControl(null),
      orderNo: new FormControl(null),
      taskDesc: new FormControl(null),
      taskStatus: new FormControl(null),
      executeTime: new FormControl(null),
    });
  }

  getOperateTicketsDetails() {
    this.operateticketsservice
      .getOperateTicketsDetails(this.ticketId)
      .subscribe((res) => {
        this.fillValue(res);
      });
  }

  fillValue(res) {
    this.title = res.title;
    this.buttons = res.buttons;
    this.fields = res.fields;
    // 典型操作票（模板）
    this.loadTemplate = res.loadTemplate;
    const values = res.ticket;

    // 图片权限
    this.picPermission = res.picPermission;
    // 文档权限
    this.docPermission = res.docPermission;
    // 抄送权限
    this.ccPermission = res.ccPermission;
    // 评论权限
    this.commentPermission = res.commentPermission;

    this.orderId = values.orderId;

    // 受令时间
    values.orderTime = _.isNumber(values.orderTime)
      ? moment(values.orderTime).format()
      : values.orderTime;

    // 操作时间
    values.startTime = _.isNumber(values.startTime)
      ? moment(values.startTime).format()
      : values.startTime;

    // 操作完成时间
    values.endTime = _.isNumber(values.endTime)
      ? moment(values.endTime).format()
      : values.endTime;

    // 填票时间
    values.createTime = _.isNumber(values.createTime)
      ? moment(values.createTime).format()
      : values.createTime;

    // 检查时间
    values.checkTime = _.isNumber(values.checkTime)
      ? moment(values.checkTime).format()
      : values.checkTime;

    if (values.tasks) {
      const control = this.form.get('tasks') as FormArray;
      while (control.length) {
        control.removeAt(control.length - 1);
      }
      values.tasks.map((item) => {
        control.push(this.initTasks());
      });
      this.tasks = values.tasks;
    } else {
      this.tasks = [];
      values.tasks = [];
    }

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

    if (this.view) {
      // 图片权限
      this.picPermission = 0;
      // 文档权限
      this.docPermission = 0;
      // 抄送权限
      this.ccPermission = 0;
      // 评论权限
      this.commentPermission = 0;
      for (const key in this.fields) {
        if (this.fields.hasOwnProperty(key)) {
          const element = this.fields[key];
          element.editable = false;
        }
      }
      this.buttons = [];
    }

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

  operateStep(type, index?, editable?) {
    if (editable === false) {
      return;
    }
    const modal = this.modalCtrl.create(
      CommonOperateStepPage,
      {
        type: type,
        value:
          type === 'add'
            ? {
                orderNo: this.tasks.length + 1,
                ticketId: this.form.value.ticketId,
              }
            : this.form.value.tasks[index],
      },
      {
        cssClass: 'commonModal commonOperateStepModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          const control = this.form.get('tasks') as FormArray;
          control.push(this.initTasks());
          if (!data.value.taskId) {
            this.tasks.push({
              taskId: data.value.taskId,
              ticketId: data.value.ticketId,
              orderNo: data.value.orderNo,
              taskDesc: data.value.taskDesc,
              taskStatus: data.value.taskStatus,
              executeTime: data.value.executeTime
                ? this.parseTime(data.value.executeTime)
                : null,
            });
            this.form.get('tasks').patchValue(this.tasks);
          }
        } else if (data.type === 'editOk') {
          this.tasks[index] = data.value;
          this.form.get('tasks').patchValue(this.tasks);
        } else if (data.type === 'delete') {
          const control = this.form.get('tasks') as FormArray;
          control.removeAt(index);
          this.tasks.splice(index, 1);
          this.tasks = this.tasks.map((item, i) => {
            return {
              ...item,
              orderNo: +i + 1,
            };
          });
          this.form.get('tasks').patchValue(this.tasks);
        }
        this.setOperateTime();
      }
    });
    modal.present();
  }

  parseTime(time) {
    if (time.indexOf('Z') !== -1) {
      return moment(time.substr(0, time.length - 1)).format();
    } else {
      return time;
    }
  }

  taskFinish(index, editable) {
    if (!editable) {
      return;
    }
    const value = this.tasks[index];
    value.executeTime = moment().format();
    this.tasks[index] = value;
    this.form.get('tasks').patchValue(this.tasks);
    this.setOperateTime();
  }

  resetTaskStatus(index, editable) {
    if (!editable) {
      return;
    }
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确认此步骤尚未完成？',
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
            const value = this.tasks[index];
            value.executeTime = null;
            this.tasks[index] = value;
            this.form.get('tasks').patchValue(this.tasks);
            this.setOperateTime();
          },
        },
      ],
    });
    confirm.present();
  }

  setOperateTime() {
    const minItem = _.minBy(this.tasks, function (o) {
      return moment(o.executeTime).valueOf();
    });
    if (minItem) {
      this.form.patchValue({
        startTime: moment(minItem.executeTime).format(),
      });
    }
    let taskFinish = 0;
    const maxItem = _.maxBy(this.tasks, function (o) {
      if (o.executeTime) {
        taskFinish++;
      }
      return moment(o.executeTime).valueOf();
    });
    if (taskFinish === this.tasks.length && maxItem) {
      this.form.patchValue({
        endTime: moment(maxItem.executeTime).format(),
      });
    }
  }

  importTypicalOperateTicket() {
    let modal = this.modalCtrl.create(CommonTypicalOperateTicketsPage, {
      stationId: this.form.value.stationId,
    });
    modal.onDidDismiss((e) => {
      if (e) {
        if (e.type === 'ok') {
          this.operateticketsservice
            .getOperateTemplate(e.value)
            .subscribe((res) => {
              if (res) {
                let operateTypeText = '';
                this.fields.operateType.props.map((item) => {
                  if (item.first === res.operateType) {
                    operateTypeText = item.second;
                  }
                });
                this.form.patchValue({
                  operateDesc: res.operateDesc,
                  operateType: res.operateType,
                  operateTypeText: operateTypeText,
                });
                if (res.tasks && res.tasks.length > 0) {
                  const control = this.form.get('tasks') as FormArray;
                  while (control.length) {
                    control.removeAt(control.length - 1);
                  }
                  res.tasks.map((item) => {
                    control.push(this.initTasks());
                  });
                  this.tasks = res.tasks;
                  this.form.patchValue({
                    tasks: this.tasks,
                  });
                  this.setOperateTime();
                }
              }
            });
        }
      }
    });
    modal.present({ keyboardClose: true });
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

  buttonFunction(button) {
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
      }
    }
    this.switchFunction(button);
  }

  switchFunction(button) {
    switch (button.buttonAction) {
      case '$check$':
        this.checkFunction();
        break;
      case 'finish':
        this.actionFunction(button);
        break;
      case 'delete':
        this.deleteFunction();
        break;
      case 'create':
        this.actionFunction(button);
        break;
      case 'permit':
        this.actionFunction(button);
        break;
      case 'reject':
        this.rejectFunction(button);
        break;
      case 'tmpSave':
        this.tmpSaveFunction(button);
        break;
      default:
        // this.deleteFunction();
        break;
    }
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
            ticketId: this.ticketId,
            checkStatus: data.value.checkStatus,
            checkMemo: data.value.checkMemo,
          };
          this.operateticketsservice.check(params).subscribe((res) => {
            this.mutilservice.popToastView('提交成功');
            this.form.patchValue({
              checkStatus: res.checkStatus,
              checkStatusText: res.checkStatusText,
              checker: res.checker,
              checkerName: res.checkerName,
              checkMemo: res.checkMemo,
              checkTime: _.isNumber(res.checkTime)
                ? moment(res.checkTime).format()
                : res.checkTime,
            });
          });
        }
      }
    });
    modal.present();
  }

  // 驳回
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
          this.formatISOTime();
          let params = {
            title: this.title,
            ticket: this.form.value,
            action: button,
            nextUserIds: null,
            memo: data.value,
          };

          this.operateticketsservice.create(params).subscribe((res) => {
            this.mutilservice.popToastView('提交成功');
            this.navCtrl.getPrevious().data.freshPage = true;
            this.navCtrl.pop();
          });
        }
      }
    });
    modal.present();
  }

  actionFunction(button) {
    this.mutilservice.customPrompt({ msg: '你确定提交吗?' }, () => {
      this.formatISOTime();
      let params = {
        title: this.title,
        ticket: this.form.value,
        action: button,
        nextUserIds: null,
        memo: null,
      };
      this.operateticketsservice.create(params).subscribe((res) => {
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
      message: '确定要删除该操作票么？',
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
            this.operateticketsservice
              .deleteOperateTickets(this.ticketId)
              .subscribe((res) => {
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

  tmpSaveFunction(button) {
    this.formatISOTime();
    let params = {
      title: this.title,
      ticket: this.form.value,
      action: button,
      nextUserIds: null,
      memo: null,
    };
    if (this.ticketId === 0) {
      this.operateticketsservice.tmpSavePost(params).subscribe((res) => {
        this.mutilservice.popToastView('暂存成功');
        this.form.patchValue({
          ticketId: res,
          orderId: res,
        });
        this.ticketId = res;
        this.orderId = res;
      });
    } else {
      this.operateticketsservice.tmpSavePut(params).subscribe((res) => {
        this.mutilservice.popToastView('暂存成功');
      });
    }
  }

  showMoreButtons() {
    this.buttonToggle = !this.buttonToggle;
  }

  viewDetails(parentOrderType) {
    switch (parentOrderType) {
      //缺陷单
      case '01':
        this.navCtrl.push(DefectManagementDetailsPage, {
          view: true,
          ticketId: this.form.value.parentOrderId,
        });
        break;
      //工作票
      case '06':
        // this.navCtrl.push(DefectManagementDetailsPage,{
        //     view:true,
        //     ticketId:this.form.value.parentOrderId
        // })
        break;
      //抢修单
      case '08':
        this.navCtrl.push(RepairTicketDetailsPage, {
          view: true,
          ticketId: this.form.value.parentOrderId,
        });
        break;

      default:
        break;
    }
  }

  formatISOTime() {
    // 受令时间
    if (this.form.value.orderTime) {
      if (this.form.value.orderTime.indexOf('Z') !== -1) {
        this.form.patchValue({
          orderTime: moment(
            this.form.value.orderTime.substr(
              0,
              this.form.value.orderTime.length - 1
            )
          ).format(),
        });
      }
    }
    // 操作时间
    if (this.form.value.startTime) {
      if (this.form.value.startTime.indexOf('Z') !== -1) {
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
    // 操作完成时间
    if (this.form.value.endTime) {
      if (this.form.value.endTime.indexOf('Z') !== -1) {
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
    // 填票时间
    if (this.form.value.createTime) {
      if (this.form.value.createTime.indexOf('Z') !== -1) {
        this.form.patchValue({
          createTime: moment(
            this.form.value.createTime.substr(
              0,
              this.form.value.createTime.length - 1
            )
          ).format(),
        });
      }
    }
    // 检查时间
    if (this.form.value.checkTime) {
      if (this.form.value.checkTime.indexOf('Z') !== -1) {
        this.form.patchValue({
          checkTime: moment(
            this.form.value.checkTime.substr(
              0,
              this.form.value.checkTime.length - 1
            )
          ).format(),
        });
      }
    }
  }
}
