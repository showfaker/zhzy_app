import { AuthHttpService } from './../../providers/auth-http.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MutilService } from '../../providers/util/Mutil.service';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
import { UserService } from '../../providers/user.servicer';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  form: FormGroup = null;
  logo: string;
  showCustomers: boolean = false;
  customers: any;
  constructor(
    public navCtrl: NavController,
    public mUtil: MutilService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private userservice: UserService,
    private fb: FormBuilder,
    private http: AuthHttpService
  ) {
    this.initForm();
    this.logo = appConfig.logo;
  }

  initForm() {
    this.form = this.fb.group({
      tenantId: new FormControl(null),
      tenantName: new FormControl(null),
      userName: new FormControl(null),
      password: new FormControl(null),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  queryCustomers(event, type) {
    console.log(type);
    if (type === 'focus') {
      if (event.value) {
        this.showCustomers = true;
      }
    } else {
      this.http.queryCustomers(event.value).subscribe((res) => {
        if (res) {
          this.customers = res;
          this.showCustomers = true;
        } else {
          this.customers = [];
          this.showCustomers = false;
        }
      });
    }
  }

  removeFocus() {
    setTimeout(() => {
      this.showCustomers = false;
    }, 500);
  }

  register(event) {
    const value = this.form.value;
    if (!value.tenantId) {
      this.mUtil.popToastView('请输入公司名称');
      return;
    }
    if (!value.userName) {
      this.mUtil.popToastView('请输入账号');
      return;
    }
    if (!value.password) {
      this.mUtil.popToastView('请输入账号');
      return;
    }
    const params = {
      tenantId: value.tenantId,
      userName: value.userName,
      password: value.password,
    };
    this.http.register(params, { responseType: 0 }).subscribe((res) => {
      this.mUtil.popToastView('注册成功');
      this.navCtrl.pop();
    });
  }

  selectCustomer(item) {
    this.form.patchValue({
      tenantName: item.customerAlias,
      tenantId: item.customerId,
    });
  }
}
