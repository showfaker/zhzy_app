import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { MutilService } from '../../providers/util/Mutil.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the BarcodeScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
})
export class BarcodeScannerPage {
  light: boolean = false; //判断闪光灯
  frontCamera: boolean; //判断摄像头
  tabBarElement: any;
  isShow = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private qrScanner: QRScanner,
    private viewCtrl: ViewController,
    public mUtil: MutilService,
    public http: HttpClient,
  ) {
    //默认为false
    this.light = false;
    this.frontCamera = false;
  }

  ionViewDidLoad() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            if (text) {
              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
              this.navCtrl.getPrevious().data.qrResult = text;
              this.mUtil.customAlert({ msg: text });
              const loginData = JSON.parse(text);
              this.auth(loginData.username, loginData.cipherpwd);
              this.mUtil.customAlert({ msg: '登录成功' });
              // const loginString = JSON.stringify(loginData);
              // this.mUtil.customAlert({ msg: loginString });
              // this.mUtil.customAlert({ msg: loginData.username });
              // this.mUtil.customAlert({ msg: loginData.cipherpwd });
              this.hideCamera();
              this.navCtrl.pop();
            } else {
              this.navCtrl.pop();
            }
          });
          this.qrScanner.show();
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  ionViewDidEnter() {
    //页面可见时才执行
    this.showCamera();
    this.isShow = true;
  }
  /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }
  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }
  hideCamera() {
    this.qrScanner.hide(); //需要关闭扫描，否则相机一直开着
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.destroy();
  }

  ionViewWillLeave() {
    this.hideCamera();
  }

  closeScanner() {
    this.navCtrl.pop();
  }

    /**
   * 鉴权接口
   * @param username
   * @param password
   */
  auth(username: string, password: string): Promise<any> {
    return this.http.post("http://www.jszyet.com.cn:8442/api/frame/auth",
    { username, password: null, cipherpwd: password })
    .pipe(
      map((response: any) => {
        const responseString = JSON.stringify(response);
        this.mUtil.customAlert({ msg: responseString });
        this.mUtil.customAlert({ msg: '登录成功！' });
        // let resObj = response;
        // this.token = resObj.token;
        // localStorage.setItem('_TOKEN_', this.token);
        // return resObj;
      }),
      catchError((error) => {
        return Observable.throw(error);
      })
    ).toPromise();
  }
}
