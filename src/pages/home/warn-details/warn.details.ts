import { MutilService } from './../../../providers/util/Mutil.service';
import { DefectManagementDetailsPage } from './../../operations/defect-management-details/defect-management-details';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { NavParams, NavController, PopoverController, ModalController } from 'ionic-angular';
import { alarmlogsService } from '../../../providers/alarmlogs.service';
import { CommonCheckMemosPage } from '../../util/modal/common-check-memos/common-check-memos';

@Component({
    selector: 'warn-details',
    templateUrl: 'warn.details.html'
})
export class WarnDetails {
    logId;
    alarmlogsDetail;
    form: FormGroup;
    buttons = [];
    constructor(
        public navCtrl: NavController,
        public alarmlogsService: alarmlogsService,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private fb: FormBuilder,
        private modalCtrl: ModalController,
        private mutilservice: MutilService
    ) {
        this.logId = this.navParams.get('logId');
        this.form = this.fb.group({
            stationName: new FormControl(null),
            deviceName: new FormControl(null),
            alarmStatus: new FormControl(null),
            alarmType: new FormControl(null),
            alarmLevel: new FormControl(null),
            startTime: new FormControl(null),
            alarmText: new FormControl(null),
            alarmCheckStatus: new FormControl(null),
            defectId: new FormControl(null),
            defectCode: new FormControl(null)
        });
    }

    ionViewWillEnter() {
        this.getalarmlogsDetail();
    }

    getalarmlogsDetail() {
        this.alarmlogsService.getalarmlogsDetail(this.logId).subscribe((e: any) => {
            if (e) {
                this.alarmlogsDetail = e;
                this.form.patchValue({
                    ...this.alarmlogsDetail,
                    defectCode: e.defectCode ? e.defectCode : '无'
                });
                this.buttons = e.buttons;
            }
        });
    }

    actionFunction(fn) {
        fn === 'defect'
            ? this.defect({
                  alarmInfo: {
                      alarmLogId: this.logId,
                      stationName: this.alarmlogsDetail.stationName,
                      stationId: this.alarmlogsDetail.stationId,
                      defectSource: '03',
                      defectSourceText: '系统告警',
                      defectDevices: this.alarmlogsDetail.deviceId
                          ? [
                                {
                                    objId: this.alarmlogsDetail.deviceId,
                                    objName: this.alarmlogsDetail.deviceName
                                }
                            ]
                          : []
                  }
              })
            : this.check();
    }

    check() {
        let modal = this.modalCtrl.create(
            CommonCheckMemosPage,
            {
                ruleId: this.alarmlogsDetail.ruleId
            },
            {
                cssClass: 'commonModal commonCheckMemosModal',
                showBackdrop: true,
                enableBackdropDismiss: true
            }
        );
        modal.onDidDismiss((data) => {
            if (data) {
                if (data.type === 'ok') {
                    this.alarmlogsService
                        .handelalarmcheck(this.alarmlogsDetail.logId, data.value)
                        .subscribe((res) => {
                            if (res) {
                                this.mutilservice.popToastView('告警已确认');
                            }
                        });
                }
            }
        });
        modal.present();
    }

    defect(params) {
        this.navCtrl.push(DefectManagementDetailsPage, params);
    }
}
