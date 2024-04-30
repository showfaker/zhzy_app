import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'pow-sta-records',
  templateUrl: 'pow.sta.records.html'
})
export class PowStaRecords {

    jibenMessage = [
        {
            name:'电站名称:',
            data:'启东盛世'
        },
        {
            name:'电站简称:',
            data:'海工车间'
        },
        {
            name:'电站编号:',
            data:'DQKH-0001'
        },
        {
            name:'设计装机容量:',
            data:'20MW'
        },
        {
            name:'并网装机容量:',
            data:'15MW'
        },
        {
            name:'并网方式:',
            data:'并网方式1'
        },
        {
            name:'并网电压等级:',
            data:'等级1'
        },
        {
            name:'组建布置方式:',
            data:'方式1'
        },
        {
            name:'组建安装角度:',
            data:'20°'
        },
        {
            name:'电站状态:',
            data:'已接入系统'
        },
        {
            name:'所属部门:',
            data:'启东办事处'
        },
        {
            name:'竣工日期:',
            data:'2018-05-06'
        },
        {
            name:'并网日期:',
            data:'2018-05-16'
        },
        {
            name:'电站站长:',
            data:'李建富'
        },
    ]
  constructor(public navCtrl: NavController,public viewCtrl:ViewController) {

  }
  close(){
    this.viewCtrl.dismiss()
  }
}
