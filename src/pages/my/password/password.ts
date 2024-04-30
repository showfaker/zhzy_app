import { UserService } from './../../../providers/user.servicer';
import { MutilService } from './../../../providers/util/Mutil.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {
  user: any;
  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private mutilservice: MutilService,
    private alertCtrl: AlertController,
    private userservice: UserService
  ) {
    this.user = JSON.parse(localStorage.getItem('USER_INFO'));
    this.form = this.fb.group({
      oldPassword: new FormControl(null),
      newPassword: new FormControl(null)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }

  changePassword() {
    this.form.value;
    if (!this.mutilservice.isValid(this.form)) {
      const alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请检查必填项！',
        buttons: ['关闭']
      });
      alert.present();
      return;
    } else {
      this.userservice.changePassword(this.form.value).subscribe((res) => {
        this.mutilservice.popToastView('密码修改成功');
        this.navCtrl.pop();
      });
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
