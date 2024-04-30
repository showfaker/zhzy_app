import { Events, ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackendService } from '../../../providers/backend.service';
import { MonitorPage } from '../../monitor/monitor';


@Component({
  selector: 'allcompany',
  templateUrl: 'all-company.html'
})
export class AllCompany {
  private hidePower: boolean;
  private stationList : {}[] = [];
  private search : string = '';
  private returnPage: string;
  private type:string;
  constructor(
    public navCtrl: NavController,
    public backendService : BackendService,
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.returnPage = this.navParams.get('returnPage');
    this.type = this.navParams.get('type');
  }
  powerStation(index) {
    this.stationList[index]['hidePower'] = !this.stationList[index]['hidePower'];
  }

  ionViewWillEnter() {
    this.getSampleStations();
  }

  getSampleStations(){
    this.backendService.getSampleStations().subscribe(e=>{
      if (e && e['content'] &&  e['content'].length>0) {
        for(let station of e['content']){
          
          let rs = this.stationList.find(data=>{
            if (data && data['provinceId'] == station['provinceId']) {
              if (!data['content']) {
                data['content'] = []
              }
              data['content'].push(station)
              return true;
            }
          })
          if (!rs) {
            this.stationList.push({provinceId:station['provinceId'],provinceName:station['provinceName'],content:[station]})
          }
        }
      }
    })
  }
  // 返回监控数据页面
  returnMonitor(content) {
    switch(this.returnPage){
      case 'MonitorPage':
        this.navCtrl.setRoot(MonitorPage,{content:content})
      break;
      case 'RunLog':
        this.events.publish('RunLogSelect',content);
        this.navCtrl.pop();
        // this.navCtrl.setRoot(RunLog,{content:content})
      break;
      case 'ImplementAlarm':
      this.events.publish('ImplementAlarmSelect',content);
      this.navCtrl.pop();
      // this.navCtrl.setRoot(RunLog,{content:content})
      break;
      case 'DefectsPage':
      this.viewCtrl.dismiss(content);
      // this.navCtrl.setRoot(RunLog,{content:content})
      break;
      case 'NewDefectsPage':
      this.events.publish('defectSelect',content);
      this.navCtrl.pop();
      break;
    }
  }

  //查询
  searchShow(name){
    if (this.search == '' || !this.search) return true;
    return name.indexOf(this.search) >= 0;
  }

  getStationNumber(station){
    let num = 0;
    if (!station || !station ["content"]) return num;
    for(let content of station ["content"]){
      if (this.searchShow(content.shortName)) {
        num++
      }
    }
    return num;
  }
}
