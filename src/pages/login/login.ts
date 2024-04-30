import { RegisterPage } from './../register/register';
import { UserService } from './../../providers/user.servicer';
import { AuthHttpService } from './../../providers/auth-http.service';
import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Events, Keyboard, NavController, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { MutilService } from '../../providers/util/Mutil.service';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
import { AppVersion } from '@ionic-native/app-version';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: { username: string; password: string };
  submitted = false;
  logo: string;
  version: string;
  // 23.06.28 密码输入框类型 --START
  inputPwdType: string = "password";
  // 23.06.28 密码输入框类型 --END
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public events: Events,
    public auth: AuthHttpService,
    public mUtil: MutilService,
    public appVersion: AppVersion,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private userservice: UserService
  ) {
    let loginobj = JSON.parse(localStorage.getItem('LOGIN_USER_INFO'));
    this.login = loginobj || { username: undefined, password: undefined };
    this.logo = appConfig.logo;
    try {
      this.appVersion
        .getVersionNumber()
        .then((e) => {
          this.version = e;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  ionViewDidLoad() {
    //   this.auth.tokenValidate().subscribe(v=>{
    //     if(v){
    //       this.navCtrl.setRoot(TabsPage);
    //     }
    //   });
  }

  ionViewDidEnter() {
    // this.platform.ready().then(() => {
    //   this.mUtil.updateApp();
    // });
  }

  onLogin(login) {
    this.auth.auth(this.login.username, this.login.password).then(
      (next) => {
        localStorage.setItem(
          'LOGIN_USER_INFO',
          JSON.stringify({
            username: this.login.username,
            password: this.login.password,
          })
        );
        this.userservice.getUserInfo().subscribe((res) => {
          if (res) {
            localStorage.setItem('USER_INFO', JSON.stringify(res));
          }
        });

        this.events.publish('login:in');
        this.navCtrl.setRoot(TabsPage, { homepage: next.homepage });
      },
      (error) => {
        // this.mUtil.popToastView('登录失败');
        // alert("登录失败");
      }
    );
  }

  register(event) {
    this.navCtrl.push(RegisterPage);
  }

  /**
   * @Description 更改密码框类型，显示/隐藏密码切换
   * @Author      zh
   * @Date        23.06.28
   */
  changeInputType() {
    this.inputPwdType = this.inputPwdType == "password" ? "text" : "password";
  }
}
