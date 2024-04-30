import { SampleStationsRespContent } from './../../../models/sample-stations-resp';
import { AllCompany } from './../../common/allCompany/all-company';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Component, ViewChild } from '@angular/core';
import { NavController, Events, List } from 'ionic-angular';
// import { NewLog } from '../new-log/new-log';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { RunLogService } from '../../../providers/runlog.service';
import { BackendService } from '../../../providers/backend.service';
import { RunlogReq } from '../../../models/runlog-req';
import { EditLog } from './edit-log/edit-log';
import { DatePipe } from '@angular/common';
import { MutilService } from '../../../providers/util/Mutil.service';
import { NewLog_old } from '../new-log/new-log';

@Component({
    selector: 'run-log',
    templateUrl: 'run-log.html'
})
export class RunLog {
    station:SampleStationsRespContent = new SampleStationsRespContent();

    runLogs: RunlogReq[] = [];
    groupName:string;
    private pipe = new DatePipe('en-US');
    @ViewChild(List) list: List;
    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public event: Events,
        public backendService: BackendService,
        public runLogService: RunLogService,
        public mutil: MutilService
    ) {
        this.event.subscribe("RunLogSelect",e=>{
            this.station = e;
            this.initLog(e);
        });
        this.event.subscribe("RunLogUpdate",()=>{
            this.initLog(this.station);
        });
    }
    /**
     * 增
     */
    newLog() {
        this.navCtrl.push(NewLog_old,{
            station : this.station
        })
    }
    /**
     * 删
     * @param runlog
     */
    delLog(runlog:RunlogReq){
        console.log("delete log:"+runlog.recordId);
        this.mutil.customPrompt({msg:"确定删除？"},()=>{
            this.runLogService.delLog(runlog.recordId).subscribe(()=>{
                this.runLogs = this.runLogs.filter(v=>v.recordId != runlog.recordId);
            });
        })
        this.list.closeSlidingItems();
    }
    /**
     * 改
     * @param runlog 
     */
    editLog(runlog:RunlogReq){
        console.log("edit log:" + runlog.recordId);
        this.navCtrl.push(EditLog,{viewOnly:false,runlog:runlog});
        this.list.closeSlidingItems();
    }
    /**
     * 查
     * @param runlog 
     */
    logDetail(runlog:RunlogReq){
        console.log("view log:" + runlog.recordId);
        this.navCtrl.push(EditLog,{viewOnly:true,runlog:runlog});
    }
    changeLocation(){
        this.navCtrl.push(AllCompany,{returnPage:"RunLog"});
    }

    ionViewDidLoad() {
        this.backendService.getGroupInfo().then(e=>{
            this.groupName = e && e['stationName'] || '';
        })
        this.backendService.getSampleStations().subscribe(e=>{
            if (e && e['content'] && e['content'].length>0) {
                this.station = e.content[0];
                this.initLog(this.station);
            }
        });
        
    }

    initLog(station:SampleStationsRespContent){
        let toDate = this.pipe.transform(new Date(),'yyyy-MM-dd');
        let fromDate = this.pipe.transform(new Date(new Date().getTime() - 31*24*3600*1000),'yyyy-MM-dd');
        this.runLogService.listLog(station.stationId,fromDate,toDate,0,10).subscribe(rs=>{
            if (rs && rs['content']) {
                this.runLogs = rs.content;
            }
            console.log(this.runLogs)
        })
    }

    // newLogPop() {
    //     let confirm = this.alertCtrl.create({
    //     title: '选择日志类型',
    //     buttons: [
    //         {
    //         text: '运行日志',
    //         handler: () => {
    //             this.navCtrl.push(NewLog)
    //         }
    //         },
    //         {
    //         text: '其他日志',
    //         handler: () => {
                
    //         }
    //         }
    //     ]
    //     });
    //     confirm.present();
    // }
}