import { RepairTicketPage } from './../repair-ticket/repair-ticket';
import { MutilService } from './../../../providers/util/Mutil.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { RepairTicketsProvider } from './../../../providers/repair-tickets.service';
import { Component, ViewChild } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ModalController,
    ActionSheetController,
    AlertController
} from 'ionic-angular';
import moment from 'moment';
import { CommonInputPage } from '../../util/modal/common-input/common-input';
import { CommonStationPage } from '../../util/common-station/common-station';
import { CommonUserPage } from '../../util/common-user/common-user';
import { CommonTeamsPage } from '../../util/common-teams/common-teams';
import { EquipmentListPage } from '../../util/common-equipment/equipmentList';
import { CommonTextareaPage } from '../../util/modal/common-textarea/common-textarea';
import { buildWorkFlow } from './work-flow.chart';
import * as _ from 'lodash';
import { CommonCheckPage } from '../../util/modal/common-check/common-check';
import { InventorisOutInPage } from '../inventoris/inventoris-out-in/inventoris-out-in';
/**
 * Generated class for the RepairTicketDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-repair-ticket-details',
    templateUrl: 'repair-ticket-details.html'
})
export class RepairTicketDetailsPage {
    @ViewChild('echart') echart;
    toggleBaseInfo = true;
    toggleProcess = false;
    toggleProcessResult = false;

    toggleDefectInspection = false;
    toggleWorkFlow = false;
    toggleWorkflowLogs = false;
    toggleComment = false;
    buttonToggle = false;

    ticketId: any;
    title: any;
    buttons: any = [];
    fields: any;

    form: FormGroup;
    team: any;
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
    parentOrderId: any;
    previousPageInfo: any;
    view: any;
    deviceId: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private repairticketsservice: RepairTicketsProvider,
        private fb: FormBuilder,
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private mutilservice: MutilService,
        private alertCtrl: AlertController
    ) {
        this.initForm();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RepairTicketDetailsPage');
        this.ticketId = this.navParams.get('ticketId') ? this.navParams.get('ticketId') : 0;
        this.deviceId = this.navParams.get('deviceId') ? this.navParams.get('deviceId') : null;
        this.parentOrderId = this.navParams.get('parentOrderId')
            ? this.navParams.get('parentOrderId')
            : null;
        this.previousPageInfo = this.navParams.get('pageInfo');
        this.view = this.navParams.get('view');
        this.getRepairTicketsDetails();
    }

    ionViewWillEnter() {
        this.freshPage = this.navParams.get('freshPage');
        if (this.freshPage) {
            this.freshPage = false;
            this.getRepairTicketsDetails();
        }
        const equipmentList = this.navParams.get('equipmentList');
        if (equipmentList) {
            this.navParams.data.equipmentList = [];
            const control = this.form.get('repairDevices') as FormArray;
            while (control.length) {
                control.removeAt(control.length - 1);
            }
            const deviceText = equipmentList.map((item) => {
                item.objId = item.deviceId;
                item.objName = item.displayName;
                item.psrId = item.psrId;
                item.deviceType = item.objType;
                control.push(this.initDevice());
                return item.displayName;
            });
            this.form.get('repairDevices').patchValue(equipmentList);
            this.form.get('repairDevicesText').patchValue(deviceText.join(','));
        }
    }

    public initForm() {
        this.form = this.fb.group({
            ticketId: new FormControl(null),
            ticketCode: new FormControl(null),
            orderId: new FormControl(null),
            parentOrderId: new FormControl(null),
            customerId: new FormControl(null),
            stationId: new FormControl(null),
            stationName: new FormControl(null),
            responsiblePerson: new FormControl(null),
            responsiblePersonName: new FormControl(null),
            creater: new FormControl(null),
            createrName: new FormControl(null),
            teamId: new FormControl(null),
            teamName: new FormControl(null),
            teamUsers: this.fb.array([]),
            teamUsersText: new FormControl(''),
            repairDevices: this.fb.array([]),
            repairDevicesText: new FormControl(''),
            repairDesc: new FormControl(null),
            precautions: new FormControl(null),
            attentions: new FormControl(null),

            // 抢修许可
            extrPrecautions: new FormControl(null),
            permitUser: new FormControl(null),
            permitUserName: new FormControl(null),
            permitTime: new FormControl(null),
            permitWorkTime: new FormControl(null),

            // 结果汇报
            startTime: new FormControl(null),
            endTime: new FormControl(null),
            workHours: new FormControl(null),
            repairStatus: new FormControl(null),
            repairStatusText: new FormControl(null),
            resultDesc: new FormControl(null),
            reportTime: new FormControl(null),

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

            // 工作流程
            workflow: this.fb.group({
                nodes: this.fb.array([]),
                links: this.fb.array([])
            }),

            // 流程日志
            workflowLogs: this.fb.array([]),

            //抄送
            ccUsers: this.fb.array([])
        });
    }

    public getRepairTicketsDetails() {
        this.repairticketsservice
            .getRepairTicketsDetails(this.ticketId, { deviceId: this.deviceId })
            .subscribe((res) => {
                this.title = res.title;
                this.buttons = res.buttons;
                this.fields = res.fields;
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

                if (this.parentOrderId) {
                    values.parentOrderId = this.parentOrderId;
                }

                if (this.previousPageInfo) {
                    values.stationId = this.previousPageInfo.stationId;
                    values.stationName = this.previousPageInfo.stationName;
                }

                // 班组人员
                if (values.teamUsers !== null) {
                    const control = this.form.get('teamUsers') as FormArray;
                    while (control.length) {
                        control.removeAt(control.length - 1);
                    }
                    const teamUsers = values.teamUsers.map((item) => {
                        control.push(this.initTeamUsers());
                        return item.userName;
                    });
                    values.teamUsersText = teamUsers.join(',');
                } else {
                    values.teamUsers = [];
                }

                // 抢修设备
                if (values.repairDevices !== null) {
                    const control = this.form.get('repairDevices') as FormArray;
                    while (control.length) {
                        control.removeAt(control.length - 1);
                    }
                    const deviceText = values.repairDevices.map((item) => {
                        control.push(this.initDevice());
                        return item.objName;
                    });
                    values.repairDevicesText = deviceText.join(',');
                } else {
                    values.repairDevicesText = '';
                    values.repairDevices = [];
                }

                // 许可同意时间
                values.permitTime = _.isNumber(values.permitTime)
                    ? moment(values.permitTime).format()
                    : values.permitTime;

                // 许可抢修时间
                values.permitWorkTime = _.isNumber(values.permitWorkTime)
                    ? moment(values.permitWorkTime).format()
                    : values.permitWorkTime;

                // 开始时间
                values.startTime = _.isNumber(values.startTime)
                    ? moment(values.startTime).format()
                    : values.startTime;
                // 结束时间
                values.endTime = _.isNumber(values.endTime)
                    ? moment(values.endTime).format()
                    : values.endTime;

                // 填写时间
                values.reportTime = _.isNumber(values.reportTime)
                    ? moment(values.reportTime).format()
                    : values.reportTime;

                // 检查时间
                values.checkTime = _.isNumber(values.checkTime)
                    ? moment(values.checkTime).format()
                    : values.checkTime;

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
                    const control = this.form.get('ccUsers') as FormArray;
                    while (control.length) {
                        control.removeAt(control.length - 1);
                    }
                    values.ccUsers.map((item) => {
                        control.push(this.initCcUser());
                    });
                    this.ccUsers = values.ccUsers;
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
            });
    }

    openSheetModal(type, typeText) {
        const options = this.fields[type]['props'];
        const buttons = options.map((item) => {
            return {
                text: item.second,
                handler: () => {
                    this.form.patchValue({
                        [type]: item.first,
                        [typeText]: item.second
                    });
                }
            };
        });
        const actionSheet = this.actionSheetCtrl.create({
            title: '',
            buttons: buttons,
            cssClass: 'commonSheet'
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
            userName: new FormControl(null)
        });
    }

    // 电站选择
    selectStation(event) {
        let modal = this.modalCtrl.create(CommonStationPage, {});
        modal.onDidDismiss((e) => {
            if (e) {
                this.form.patchValue({
                    stationId: e.id,
                    stationName: e.title
                });
            }
        });
        modal.present({ keyboardClose: true });
    }

    // 人员选择器
    selectUser(id, name) {
        const value = this.form.value;
        const modal = this.modalCtrl.create(CommonUserPage, {
            isSingle: true,
            selectedItem: [{ userId: value[id], userName: value[name] }]
        });
        modal.onDidDismiss((data) => {
            if (data) {
                if (data.type == 'ok') {
                    this.form.patchValue({
                        [id]: data.value[0] ? data.value[0].userId : null,
                        [name]: data.value[0] ? data.value[0].realName : null
                    });
                } else {
                    this.form.patchValue({
                        [id]: null,
                        [name]: null
                    });
                }
            }
        });
        modal.present();
    }

    //班组
    selectTeam() {
        let modal = this.modalCtrl.create(CommonTeamsPage, {
            team: this.team
        });
        modal.onDidDismiss((data) => {
            if (data && data.type === 'ok') {
                this.team = data.value;
                this.form.patchValue({
                    teamId: this.team.teamId,
                    teamName: this.team.teamName
                });
                const control = this.form.get('teamUsers') as FormArray;
                while (control.length) {
                    control.removeAt(control.length - 1);
                }
                const teamUsers = [];
                const teamUserText = this.team.users.map((item) => {
                    teamUsers.push({
                        userId: item.userId,
                        userName: item.userName,
                        account: item.account,
                        userIcon: item.userIcon,
                        deptName: item.deptName
                    });
                    control.push(this.initTeamUsers());
                    return item.userName;
                });
                this.form.get('teamUsersText').patchValue(teamUserText.join(','));
                this.form.get('teamUsers').patchValue(teamUsers);
            } else if (data && data.type === 'clear') {
                this.team = null;
                this.form.patchValue({
                    teamId: this.team.teamId,
                    teamName: this.team.teamName,
                    teamUsersText: ''
                });
                const control = this.form.get('teamUsers') as FormArray;
                while (control.length) {
                    control.removeAt(control.length - 1);
                }
            }
        });
        modal.present();
    }

    // 班组人员
    selectTeamUsers(event, editable) {
        const value = this.form.value;
        const selectedItem = [];
        value.teamUsers.map((item) => {
            selectedItem.push({
                userId: item.userId,
                realName: item.userName,
                userName: item.account,
                icon: item.userIcon,
                deptName: item.deptName
            });
        });
        const modal = this.modalCtrl.create(CommonUserPage, {
            isSingle: false,
            selectedItem: selectedItem,
            editable
        });
        modal.onDidDismiss((data) => {
            if (data) {
                if (data.type == 'ok') {
                    const control = this.form.get('teamUsers') as FormArray;
                    while (control.length) {
                        control.removeAt(control.length - 1);
                    }
                    const teamUsers = [];
                    const teamUserText = data.value.map((item) => {
                        teamUsers.push({
                            userId: item.userId,
                            userName: item.realName,
                            account: item.userName,
                            userIcon: item.icon,
                            deptName: item.deptName
                        });
                        control.push(this.initTeamUsers());
                        return item.realName;
                    });
                    this.form.get('teamUsers').patchValue(teamUsers);
                    this.form.get('teamUsersText').patchValue(teamUserText.join(','));
                }
            } else if (data && data.length === 0) {
                this.form.patchValue({
                    teamUsersText: '',
                    teamUsers: []
                });
            }
        });
        modal.present();
    }

    initTeamUsers() {
        return new FormGroup({
            userId: new FormControl(null),
            userName: new FormControl(null),
            account: new FormControl(null),
            userIcon: new FormControl(null),
            deptName: new FormControl(null)
        });
    }

    //选择设备
    selectEquipment(editable) {
        if (!this.form.value.stationId) {
            this.mutilservice.popToastView('请先选择电站');
            return;
        }
        const selectedItem = [];
        if (this.form.value.repairDevices !== null) {
            this.form.value.repairDevices.map((item) => {
                selectedItem.push({
                    deviceId: item.objId,
                    displayName: item.objName,
                    psrId: item.psrId,
                    objType: item.deviceType
                });
            });
        }

        this.navCtrl.push(EquipmentListPage, {
            stationId: this.form.value.stationId,
            isSingle: false,
            selectedItem: selectedItem,
            editable
        });
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
                value: this.form.value[key]
            },
            {
                cssClass: 'commonModal commonTextareaModal',
                showBackdrop: true,
                enableBackdropDismiss: true
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

    openInputModal(type, editable) {
        if (!editable) {
            return;
        }
        const modal = this.modalCtrl.create(
            CommonInputPage,
            {
                value: this.form.value[type],
                title: this.fields[type]['name']
            },
            {
                cssClass: 'commonModal commonInputModal',
                showBackdrop: true,
                enableBackdropDismiss: true
            }
        );
        modal.onDidDismiss((data) => {
            if (data) {
                this.form.patchValue({
                    [type]: data.value ? parseFloat(data.value) : null
                });
            }
        });
        modal.present();
    }

    // 初始化 缺陷设备form
    initDevice() {
        return new FormGroup({
            objCompany: new FormControl(null),
            objId: new FormControl(null),
            objName: new FormControl(null),
            objProvider: new FormControl(null),
            objType: new FormControl(null),
            orderId: new FormControl(null),
            psrId: new FormControl(null),
            psrName: new FormControl(null),
            relaId: new FormControl(null)
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
            updaterName: new FormControl(null)
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
            status: new FormControl(null)
        });
    }

    initLinks() {
        return new FormGroup({
            sourceId: new FormControl(null),
            targetId: new FormControl(null),
            source: new FormControl(null),
            target: new FormControl(null)
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
            ccUsers: data
        });
    }

    initCcUser() {
        return new FormGroup({
            userId: new FormControl(null),
            userName: new FormControl(null)
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

    formatISOTime() {
        if (this.form.value.startTime) {
            if (this.form.value.startTime.indexOf('Z') !== -1) {
                this.form.patchValue({
                    startTime: moment(
                        this.form.value.startTime.substr(0, this.form.value.startTime.length - 1)
                    ).format()
                });
            }
        }
        if (this.form.value.endTime) {
            if (this.form.value.endTime.indexOf('Z') !== -1) {
                this.form.patchValue({
                    endTime: moment(
                        this.form.value.endTime.substr(0, this.form.value.endTime.length - 1)
                    ).format()
                });
            }
        }
        if (this.form.value.startTime && this.form.value.endTime) {
            if (
                moment(this.form.value.endTime).valueOf() -
                    moment(this.form.value.startTime).valueOf() <
                0
            ) {
                this.mutilservice.popToastView('开始处理时间要小于处理完成时间！');
                this.form.patchValue({
                    startTime: null
                });
                return;
            }
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
                        buttons: ['关闭']
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
            case '$remind$':
                this.remindFunction();
                break;
            case '$check$':
                this.checkFunction();
                break;
            case 'materialOut':
                this.materialOutFunction();
                break;
            case 'materialIn':
                this.materialInFunction();
                break;
            case 'reject':
                this.rejectFunction(button);
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
            default:
                // this.deleteFunction();
                break;
        }
    }

    remindFunction() {
        this.repairticketsservice.remind(this.ticketId).subscribe((res) => {
            this.mutilservice.popToastView(res);
        });
    }

    // 检查操作
    checkFunction() {
        const modal = this.modalCtrl.create(
            CommonCheckPage,
            {
                options: this.fields['checkStatus'].props
            },
            {
                cssClass: 'commonModal commonCheckModal',
                showBackdrop: true,
                enableBackdropDismiss: true
            }
        );
        modal.onDidDismiss((data) => {
            if (data) {
                if (data.type === 'ok') {
                    let params = {
                        ticketId: this.ticketId,
                        checkStatus: data.value.checkStatus,
                        checkMemo: data.value.checkMemo
                    };
                    this.repairticketsservice.check(params).subscribe((res) => {
                        this.mutilservice.popToastView('提交成功');
                        this.form.patchValue({
                            checkStatus: res.checkStatus,
                            checkStatusText: res.checkStatusText,
                            checker: res.checker,
                            checkerName: res.checkerName,
                            checkMemo: res.checkMemo,
                            checkTime: _.isNumber(res.checkTime)
                                ? moment(res.checkTime).format()
                                : res.checkTime
                        });
                    });
                }
            }
        });
        modal.present();
    }

    // 出库
    materialOutFunction() {
        const user = JSON.parse(localStorage.getItem('USER_INFO'));
        this.navCtrl.push(InventorisOutInPage, {
            type: 'out',
            relaBusinessTypeText: '抢修单号',
            value: {
                relaBusinessId: this.form.value.orderId,
                relaBusinessCode: this.form.value.ticketCode,
                ioOperator: user.userId,
                ioTime: moment().format(),
                ioOperatorName: user.realName
            }
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
                relaBusinessCode: this.form.value.ticketCode,
                ioOperator: user.userId,
                ioTime: moment().format(),
                ioOperatorName: user.realName
            }
        });
    }

    // 申请/许可/完成
    actionFunction(button) {
        this.mutilservice.customPrompt({ msg: '你确定提交吗?' }, () => {
            this.formatISOTime();
            let params = {
                title: this.title,
                ticket: this.form.value,
                action: button,
                nextUserIds: null,
                memo: null
            };
            this.repairticketsservice.create(params).subscribe((res) => {
                if (this.parentOrderId) {
                    this.navCtrl.remove(1, 2);
                    this.navCtrl.insertPages(1, [{ page: RepairTicketPage }]);
                }
                this.mutilservice.popToastView('提交成功');
                this.navCtrl.getPrevious().data.freshPage = true;
                this.navCtrl.pop();
            });
        });
    }

    // 驳回
    rejectFunction(button) {
        const modal = this.modalCtrl.create(
            CommonTextareaPage,
            {
                title: '说明'
            },
            {
                cssClass: 'commonModal commonTextareaModal',
                showBackdrop: true,
                enableBackdropDismiss: true
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
                        memo: data.value
                    };

                    this.repairticketsservice.create(params).subscribe((res) => {
                        this.mutilservice.popToastView('提交成功');
                        this.navCtrl.getPrevious().data.freshPage = true;
                        this.navCtrl.pop();
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
            message: '确定要删除该抢修单么?',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.repairticketsservice
                            .detelterepairTickets(this.ticketId)
                            .subscribe((res) => {
                                this.mutilservice.popToastView('删除成功');
                                this.navCtrl.getPrevious().data.freshPage = true;
                                this.navCtrl.pop();
                            });
                    }
                }
            ]
        });
        confirm.present();
    }
}
