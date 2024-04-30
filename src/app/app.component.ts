import { Component, ViewChild } from '@angular/core';
import {
  Platform,
  ModalController,
  Events,
  Tabs,
  App,
  AlertController,
  IonicApp,
  Nav,
  Keyboard,
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { MutilService } from '../providers/util/Mutil.service';
import { HomeService } from '../providers/home.service';
import { WarnMessage } from '../pages/home/warn-message/warn.message';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SettingsProvider } from '../providers/settings/settings';
declare var screen: any;
@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: any = LoginPage;
  alarmNoticInterval;
  backButtonPressed: any;
  searcMenu: any;
  selectedTheme: string;
  @ViewChild(Nav) nav: Nav;
  constructor(
    private platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public mUtils: MutilService,
    public modalCtrl: ModalController,
    public homeService: HomeService,
    public events: Events,
    private androidPermissions: AndroidPermissions,
    private appCtrl: App,
    private alertCtrl: AlertController,
    private ionicApp: IonicApp,
    private keyboard: Keyboard,
    private settings: SettingsProvider
  ) {
    splashScreen.show();
    this.settings
      .getActiveTheme()
      .subscribe((val) => (this.selectedTheme = val));
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      splashScreen.hide();
      screen.orientation.lock('portrait');
      if (this.platform.is('android')) {
        this.requestPermission();
      } else {
      }

      setTimeout(() => {
        // this.mUtils.updateApp();
      }, 3000);
    });
    this.events.subscribe('login:in', () => {
      this.alarmNoticInterval = setInterval(() => {
        this.homeService.alarmNoticeInfo().subscribe((e) => {
          if (e.msg) {
            this.showContent(e.msg);
          }
        });
      }, 60 * 1000);
    });
    this.events.subscribe('login:out', () => {
      clearInterval(this.alarmNoticInterval);
    });
    this.registerBackButtonAction(this.rootPage); //注册返回按键事件
  }

  showContent(message) {
    this.mUtils.customPrompt({ msg: message }, (rs) => {
      // let modal = this.modalCtrl.create(WarnMessage, {
      //     objType: '05',
      //     objIds: ''
      // });
      // modal.onDidDismiss((e) => {});
      // modal.present();
      // this.navCtrl.push(WarnMessage);
    });
  }

  requestPermission() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        (result) => {
          console.log('相机权限?', result.hasPermission);
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.CAMERA
            );
          }
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.CAMERA
          )
      );
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
      .then(
        (result) => {
          console.log('录音权限?', result.hasPermission);
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.RECORD_AUDIO
            );
          }
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.RECORD_AUDIO
          )
      );
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      .then(
        (result) => {
          console.log('定位权限?', result.hasPermission);
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
            );
          }
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
          )
      );
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(
        (result) => {
          console.log('文件读取权限?', result.hasPermission);
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
            );
          }
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          )
      );
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.REQUEST_INSTALL_PACKAGES
      )
      .then(
        (result) => {
          console.log('自动更新权限?', result.hasPermission);
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.REQUEST_INSTALL_PACKAGES
            );
          }
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.REQUEST_INSTALL_PACKAGES
          )
      );
  }

  registerBackButtonAction(tabRef: Tabs): void {
    this.platform.registerBackButtonAction((): any => {
      //按下返回键时，先关闭键盘
      if (this.keyboard.isOpen()) {
        //按下返回键时，先关闭键盘
        this.keyboard.close();
        return;
      }
      let activePortal =
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      let loadingPortal = this.ionicApp._loadingPortal.getActive();
      if (activePortal) {
        //其他的关闭
        activePortal.dismiss().catch(() => { });
        activePortal.onDidDismiss(() => { });
        return;
      }
      if (loadingPortal) {
        //loading的话，返回键无效
        return;
      }

      // 获取已激活页面
      let activeVC = this.nav.getActive();
      let page = activeVC.instance;
      if (!(page instanceof TabsPage)) {
        if (!this.nav.canGoBack()) {
          // 当前页面为tabs，退出APP
          return this.showExit();
        }
        // 当前页面为tabs的子页面，正常返回
        return this.nav.pop();
      }
      let tabs = page.tabs;
      let activeNav = tabs.getSelected();
      if (!activeNav.canGoBack()) {
        // 当前页面为tab栏，退出APP
        return this.showExit();
      }
      // 当前页面为tab栏的子页面，正常返回
      return activeNav.pop();
    }, 101);
  }

  //退出应用方法
  private showExit(): void {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: `确定要退出程序么？`,
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          },
        },
        {
          text: '确定',
          handler: () => {
            this.platform.exitApp();
          },
        },
      ],
    });
    confirm.present();
  }
}
