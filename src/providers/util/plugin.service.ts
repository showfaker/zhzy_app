import { MutilService } from './Mutil.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {
  ActionSheetController,
  Events,
  normalizeURL,
  Platform,
  ToastController,
  AlertController,
} from 'ionic-angular';
import { Injectable, Inject } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
import { AuthHttpService } from '../auth-http.service';
import { AppVersion } from '@ionic-native/app-version';

@Injectable()
export class PluginService {
  downloadUrl: string;
  deleteDocUrl: string;
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private filePath: FilePath,
    public http: AuthHttpService,
    private appVersion: AppVersion,
    private mutilservice: MutilService
  ) {
    this.downloadUrl = this.appConfig.apiEndpoint + '/api/doc/download';
    this.deleteDocUrl = this.appConfig.apiEndpoint + '/api/doc/delete';
  }
  /**
   *  拍照插件
   *  $ ionic cordova plugin add cordova-plugin-camera
   *  $ npm install --save @ionic-native/camera
   *  API地址 ： http://ionicframework.com/docs/native/camera/
   */
  useCamera(callBack) {
    let that = this;
    let options: CameraOptions = {
      quality: 80, //100容易引起崩溃
      sourceType: 1,
      destinationType: this.camera.DestinationType.FILE_URI,
      targetWidth: 1000, //头像宽度
      targetHeight: 1000, //头像高度
      correctOrientation: true,
    };
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'ssss',
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.camera.getPicture(options).then(
              (imageDate) => {
                callBack(imageDate);
              },
              (err) => {
                console.log(err);
              }
            );
            console.log('拍照 clicked');
          },
        },
        {
          text: '从相册中选取',
          handler: () => {
            options.sourceType = 0;
            let imagePickerOpt = {
              sourceType: 0,
              maximumImagesCount: 10, //选择一张图片
              quality: 80,
              destinationType: this.camera.DestinationType.FILE_URI,
              targetWidth: 1000, //头像宽度
              targetHeight: 1000, //头像高度
              correctOrientation: true,
            };
            this.camera.getPicture(imagePickerOpt).then(
              (imageDate) => {
                callBack(imageDate);
              },
              (err) => {
                console.log(err);
              }
            );
            console.log('从相册中选取 clicked');
          },
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('取消 clicked');
          },
        },
      ],
    });
    actionSheet.present();
    console.log('Clicked to update picture');
  }

  presentToast(data) {
    let msg = {
      message: data.message ? data.message : '提示信息有误!',
      duration: data.duration ? data.duration : 'short', // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: data.position ? data.position : 'bottom',
      cssClass: 'myCenter',
      // addPixelsY: -40 // added a negative value to move it up a bit (default 0)
    };
    let toast = this.toastCtrl.create(msg);
    toast.present();
  }
  /**
   * 上传文件到服务器
   * @param fileUrl 本地文件路径
   * @param uploadUrl 上传服务端地址
   * @returns 远程文件的路径
   */
  public uploadPic(
    fileUrl: string,
    uploadUrl: string,
    fileKey?: string,
    params?: any
  ): Promise<string> {
    if (this.platform.is('ios')) {
      let token = localStorage.getItem('_TOKEN_');
      let options: FileUploadOptions = {
        fileKey: fileKey || 'file', //相当于form表单项的name属性
        fileName: fileUrl.substr(fileUrl.lastIndexOf('/') + 1),
        mimeType: 'image/*',
        headers: { Authorization: 'Bearer ' + token },
        params: this.mutilservice.filterEffectParam(params),
      };
      const filePath = normalizeURL(fileUrl);
      const fileTransfer: FileTransferObject = this.transfer.create();
      return fileTransfer
        .upload(filePath, this.appConfig.apiEndpoint + uploadUrl, options)
        .then((e) => JSON.parse(e.response));
    } else {
      return this.filePath.resolveNativePath(fileUrl).then((filePath) => {
        let token = localStorage.getItem('_TOKEN_');
        let options: FileUploadOptions = {
          fileKey: fileKey || 'file', //相当于form表单项的name属性
          fileName: filePath.substr(filePath.lastIndexOf('/') + 1),
          mimeType: 'image/*',
          headers: { Authorization: 'Bearer ' + token },
          params: this.mutilservice.filterEffectParam(params),
        };
        const fileTransfer: FileTransferObject = this.transfer.create();
        return fileTransfer
          .upload(filePath, this.appConfig.apiEndpoint + uploadUrl, options)
          .then((e) => JSON.parse(e.response));
      });
    }
  }

  public deleteDoc(docId) {
    return this.http.delete(this.deleteDocUrl + '?docIds=' + docId);
  }

  /**
   * 上传文件到服务器
   * @param fileUrl 本地文件路径
   * @param uploadUrl 上传服务端地址
   * @returns 远程文件的路径
   */
  public uploadDoc(fileUrl: string, uploadUrl: string, fileKey?: string): Promise<string> {
    if (this.platform.is('ios')) {
      let token = localStorage.getItem('_TOKEN_');
      let options: FileUploadOptions = {
        fileKey: fileKey || 'file', //相当于form表单项的name属性
        fileName: fileUrl.substr(fileUrl.lastIndexOf('/') + 1),
        mimeType: 'image/*',
        headers: { Authorization: 'Bearer ' + token },
      };
      const filePath = normalizeURL(fileUrl);
      const fileTransfer: FileTransferObject = this.transfer.create();
      return fileTransfer
        .upload(filePath, this.appConfig.apiEndpoint + uploadUrl, options)
        .then((e) => JSON.parse(e.response));
    } else {
      return this.filePath.resolveNativePath(fileUrl).then((filePath) => {
        let token = localStorage.getItem('_TOKEN_');
        let options: FileUploadOptions = {
          fileKey: fileKey || 'file', //相当于form表单项的name属性
          fileName: filePath.substr(filePath.lastIndexOf('/') + 1),
          headers: { Authorization: 'Bearer ' + token },
        };
        if (this.platform.is('ios')) {
          filePath = normalizeURL(filePath);
        }
        const fileTransfer: FileTransferObject = this.transfer.create();
        return fileTransfer
          .upload(decodeURI(filePath), this.appConfig.apiEndpoint + uploadUrl, options)
          .then((e) => JSON.parse(e.response));
      });
    }
  }

  public downloadFile(downloadUrl, docName, params?: any) {
    let token = localStorage.getItem('_TOKEN_');
    let options: FileUploadOptions = {
      headers: { Authorization: 'Bearer ' + token },
      params: this.mutilservice.filterEffectParam(params),
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.onProgress((progressEvent) => {
      if (progressEvent.lengthComputable) {
        // 下载过程会一直打印，完成的时候会显示 1
        console.log(progressEvent.loaded / progressEvent.total);
      }
    });

    let savePath = '';
    if (this.platform.is('ios')) {
      savePath = this.file.dataDirectory; // documentsDirectory
      fileTransfer
        .download(encodeURI(downloadUrl), savePath + docName, true, options)
        .then(
          (entry) => {
            console.log(entry.toURL());
            const alertSuccess = this.alertCtrl.create({
              title: `提示`,
              subTitle: `文件下载完成`,
              buttons: ['确认'],
            });

            alertSuccess.present();
          },
          (err) => {
            console.log(err);
          }
        )
        .catch((err) => {
          console.log(err);
        });
    } else {
      savePath = this.file.externalRootDirectory + 'com.cie.nems/files/';
      fileTransfer
        .download(encodeURI(downloadUrl), savePath + docName, true, options)
        .then(
          (entry) => {
            console.log(entry.toURL());
            const alertSuccess = this.alertCtrl.create({
              title: `提示`,
              subTitle: `文件已保存到/com.cie.nems/files`,
              buttons: ['确认'],
            });

            alertSuccess.present();
          },
          (err) => {
            console.log(err);
          }
        )
        .catch((err) => {
          console.log(err);
        });
    }

    // fileTransfer
    //     .download(
    //         encodeURI(this.downloadUrl + '?docId=' + docId),
    //         this.file.externalApplicationStorageDirectory + 'files/' + docName,
    //         true,
    //         options
    //     )
  }
}
