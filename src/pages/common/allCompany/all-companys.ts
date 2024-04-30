import { Events, ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackendService } from '../../../providers/backend.service';
@Component({
  selector: 'allcompany',
  templateUrl: 'all-companys.html'
})
export class AllCompanys {
  private stationList : {}[] = [];
  private returnPage: string;
  search:string;
  // private type:string;
  stationIds;
  constructor(
    public navCtrl: NavController,
    public backendService : BackendService,
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.returnPage = this.navParams.get('returnPage');
    // this.type = this.navParams.get('type');
    this.stationIds = this.navParams.get('stationIds');
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
          if (this.stationIds) {
            station['select'] = this.stationIds.indexOf(station['stationId'])>-1
          }
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
  returnMonitor() {
    let stationIds = '';
    for(let station of this.stationList){
      let contents = station["content"]
      for(let content of contents){
        if (content.select) {
          stationIds = stationIds+content.stationId+',';
        }
      }
    }
    if (stationIds) {
      stationIds = stationIds.slice(0,stationIds.length-1);
    }
    switch(this.returnPage){
      case 'DefectsPage':
      this.viewCtrl.dismiss({stationIds:stationIds,miss:true});
      // this.navCtrl.setRoot(RunLog,{content:content})
      break;
    }
  }

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

  select(content){
    content.select = !content.select;
  }

  resetModel(){
    // this.stationList  = [];
    // this.getSampleStations();
    for(let station of (this.stationList||[])){
      let contents = station["content"];
      for(let content of (contents || [])){
        content.select = false;
      }
    }
  }
}
