import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'pow-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  buttonList = [
    {
      name: '正序',
      value: 'asc',
      active: false
    },
    {
      name: '倒序',
      value: 'desc',
      active: false
    }
  ]
  rankingButtonList = [
    {
      name: '日发电量',
      value: 'AI-NB-ZXYGDD-D',
      active: false
    },
    {
      name: '月发电量',
      value: 'AI-NB-ZXYGDD-M',
      active: false
    },
    {
      name: '日等效时数',
      value: 'AI-NB-ZXYGDXS-D',
      active: false
    },
    {
      name: '月等效时数    ',
      value: 'AI-NB-ZXYGDXS-M',
      active: false
    }
  ]
  inverterrankParam = {
    cateId: 'AI-NB-ZXYGDXS-D',
    sort: 'desc'
  }
  constructor(
    public navCtrl: NavController,
    public navParms: NavParams,
    public viewCtrl: ViewController
  ) {
    this.inverterrankParam = this.navParms.get('inverterrankParam')
  }

  select(type, value) {
    this.inverterrankParam[type] = value;
  }

  close(type) {
    if (type == 'y') {
      this.viewCtrl.dismiss(this.inverterrankParam)
    } else {
      this.viewCtrl.dismiss()
    }
  }
}