import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { MutilService } from '../../providers/util/Mutil.service';
import { AppVersion } from '@ionic-native/app-version';
import { PasswordPage } from './password/password';
@Component({
  selector: 'page-my',
  templateUrl: 'my.html',
})
export class MyPage {
  version;
  user: any;
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public mUtils: MutilService,
    public appVersion: AppVersion
  ) {
    this.user = JSON.parse(localStorage.getItem('USER_INFO'));

    this.appVersion
      .getVersionNumber()
      .then((e) => {
        this.version = e;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  changePassword() {
    this.navCtrl.push(PasswordPage);
  }

  loginOut() {
    this.mUtils.customPrompt({ msg: '是否退出?' }, () => {
      this.events.publish('login:out');
    });
  }
}
