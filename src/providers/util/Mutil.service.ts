import {
  AlertController,
  ToastController,
  Events,
  LoadingController,
} from 'ionic-angular';
import { Injectable, Inject } from '@angular/core';
import { AppUpdate } from '@ionic-native/app-update';
import { Platform } from 'ionic-angular/platform/platform';
import { AppConfig, APP_CONFIG } from '../../models/app-config';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';

@Injectable()
export class MutilService {
  updateUrl: string;
  constructor(
    public platform: Platform,
    private alertCtrl: AlertController,
    private appUpdate: AppUpdate,
    public toastCtrl: ToastController,
    public events: Events,
    private loadingCtrl: LoadingController,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.updateUrl = this.appConfig.checkUpdateUrl;
    this.events.subscribe('AUTH_ERROR', (e) => {
      console.log(e);

      if (e) {
        this.popToastView(e.message);
      }
      this.popToastView('');
    });
  }

  /**
   * 弱提示框
   */
  popToastView(message: string) {
    this.toastCtrl
      .create({
        message: message,
        position: 'middle',
        duration: 2000,
      })
      .present();
  }

  /**
   * 判断密码是否符合规范
   * @param password
   */
  isValidPassword(password) {
    if (!/^[A-Za-z0-9]{6,16}$/.test(password)) {
      this.popToastView('密码为6-16位的字母或数字');
      return false;
    } else {
      return true;
    }
  }

  /**
   * 判断邮箱号是否正确
   * @param mail
   */
  isValidMail(mail) {
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(mail)) {
      this.popToastView('请输入正确的邮箱');
      return false;
    } else {
      return true;
    }
  }

  /**
   * 判断电话号码是否正确
   * @param mobile
   */
  isValidMobile(mobile) {
    if (!/^1[3|4|5|7|8]\d{9}$/.test(mobile)) {
      this.popToastView('请输入正确的手机号');
      return false;
    } else {
      return true;
    }
  }

  /**格式化时间 */
  buildTime(type: string, time): string {
    if (!type || !time) {
      return '';
    }
    let arrs = type.split('-');
    let t = '';
    let d = new Date(time);
    for (let arr of arrs) {
      switch (arr) {
        case 'yyyy':
          t = t + d.getFullYear() + '-';
          break;
        case 'MM':
          let m = '0' + (d.getMonth() + 1);
          m = m.substring(m.length - 2, m.length);
          t = t + m + '-';

          break;
        case 'dd':
          let dd = '0' + d.getDate();
          dd = dd.substring(dd.length - 2, dd.length);
          t = t + dd + ' ';
          break;
        case 'hh':
          t = t + d.getHours() + ':';
          break;
        case 'mm':
          t = t + d.getMinutes() + ':';
          break;
      }
    }
    return t.substring(0, t.length - 1);
  }

  /**获取当月最后一天日期 日 */
  getLastDay(d) {
    let year = parseInt(d.split('-')[0]);
    let month = parseInt(d.split('-')[1]);
    let new_year = year; //取当前的年份
    let new_month = month + 1; //取下一个月的第一天，方便计算（最后一天不固定）
    if (month > 12) {
      //如果当前大于12月，则年份转到下一年
      new_month -= 12; //月份减
      new_year++; //年份增
    }
    let new_date = new Date(`${new_year}-${new_month}-${1}`); //取当年当月中的第一天
    return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期
  }

  loading;
  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        spinner: 'crescent',
      });
      this.loading.present();
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  /**
   * alert提示
   * @param res
   * @param backfunction
   */
  customAlert(res: { title?: string; msg: string }, backfunction?) {
    if (!(res && res['msg'])) {
      return;
    }
    let alert = this.alertCtrl.create({
      title: res['title'] || '提示',
      subTitle: res['msg'],
      buttons: [
        {
          text: '确定',
          handler: (data) => {
            if (backfunction) {
              backfunction();
            }
          },
        },
      ],
    });
    alert.present();
  }

  /**
   * 带有取消按钮的 确认框
   * @param res
   * @param backfunction
   */
  prompt;
  customPrompt(res: { title?: string; msg: string }, backfunction?) {
    if (!(res && res['msg'])) {
      return;
    }
    if (this.prompt) {
      return;
    }
    this.prompt = this.alertCtrl.create({
      title: res['title'] || '提示',
      subTitle: res['msg'],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            this.prompt = null;
            console.log('Cancel clicked');
          },
        },
        {
          text: '确定',
          role: 'ok',
          handler: (data) => {
            if (backfunction) {
              backfunction();
            }
            this.prompt = null;
          },
        },
      ],
    });
    this.prompt.present();
  }

  updateApp() {
    if (this.platform.is('ios')) {
      console.log('ios无法自动更新');
      return;
    }
    this.appUpdate
      .checkAppUpdate(this.updateUrl)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //退出
  showExit() {
    this.customPrompt({ msg: '是否退出应用？' }, (rs) => {
      this.platform.exitApp();
    });
  }

  public isValid(form: FormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        if ((form.controls[key] as FormGroup).controls) {
          this.isValid(form.controls[key] as FormGroup);
        } else {
          if (!form.controls[key].valid) {
            form.controls[key].markAsDirty();
          }
        }
      }
    }
    return form.valid;
  }

  public filterEffectParam(params: any) {
    _.forEach(params, (value, key) => {
      if (_.isObject(value) || _.isArray(value)) {
        if (_.isEmpty(value)) {
          params = _.omit(params, key);
        }
      }
      if (_.isNull(value)) {
        params = _.omit(params, key);
      }
    });
    return params;
  }
}
