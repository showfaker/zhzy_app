import { ActionSheetController, Platform } from 'ionic-angular';
import { MutilService } from './../../providers/util/Mutil.service';
import { PluginService } from './../../providers/util/plugin.service';
import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
import * as _ from 'lodash';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';
/**
 * Generated class for the UploadPicsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'upload-pics',
  templateUrl: 'upload-pics.html',
})
export class UploadPicsComponent {
  @Input() orderId = null;
  @Output() public picsEvent = new EventEmitter<any>();
  fileBasePath: any;
  @Input() pics = [];
  @Input() picPermission = 0;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private imagePicker: ImagePicker,
    private pluginservice: PluginService,
    private mutilservice: MutilService,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private filePicker: IOSFilePicker,
    private photoViewer: PhotoViewer,
  ) {
    console.log('Hello UploadPicsComponent Component');
    this.fileBasePath = this.appConfig.fileEndpoint;
  }

  chooseType() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.takePhoto();
          },
        },
        {
          text: '从相册选择',
          handler: () => {
            this.upload();
          },
        },
        {
          text: '取消',
          handler: () => {
            console.log('cancel');
          },
        },
      ],
      cssClass: 'commonSheet',
    });

    actionSheet.present().then((value) => {
      return value;
    });
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: false,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
    };

    this.camera.getPicture(options).then(
      (image) => {
        console.log('Image URI: ' + image);
        // this.avatar = image.slice(7);
        this.pluginservice
          .uploadPic(
            image,
            this.orderId
              ? '/api/workOrders/uploadPics?orderId=' + this.orderId
              : '/api/workOrders/uploadPics',
          )
          .then((res: any) => {
            this.pics.push(res.data);
            this.picsEvent.emit(this.pics);
          });
      },
      (error) => {
        console.log('Error: ' + error);
      },
    );
  }

  upload() {
    // if (this.platform.is('android')) {
    this.imagePicker.getPictures({ maximumImagesCount: 1, width: 200, height: 200 }).then(
      (results) => {
        this.pluginservice
          .uploadPic(
            results[0],
            this.orderId
              ? '/api/workOrders/uploadPics?orderId=' + this.orderId
              : '/api/workOrders/uploadPics',
          )
          .then((res: any) => {
            console.log(res.data);
            this.pics.push(res.data);
            this.picsEvent.emit(this.pics);
            this.mutilservice.popToastView('上传成功');
          });
      },
      (err) => {
        console.log(err);
      },
    );
    // } else {
    //   this.filePicker
    //     .pickFile()
    //     .then((uri) => {
    //       this.pluginservice
    //         .uploadDoc(
    //           uri,
    //           this.orderId
    //             ? '/api/workOrders/uploadDocs?orderId=' + this.orderId
    //             : '/api/workOrders/uploadDocs',
    //         )
    //         .then((res: any) => {
    //           this.pics.push(res);
    //           this.picsEvent.emit(this.pics);
    //           this.mutilservice.popToastView('上传成功');
    //         });
    //     })
    //     .catch((err) => console.log('Error', err));
    // }
  }

  deletePic(docId) {
    this.pluginservice.deleteDoc(docId).subscribe((res) => {
      _.remove(this.pics, function (img) {
        return img.docId === docId;
      });
      this.mutilservice.popToastView('删除成功');
    });
  }

  viewPic(url) {
    this.photoViewer.show(url);
  }
}
