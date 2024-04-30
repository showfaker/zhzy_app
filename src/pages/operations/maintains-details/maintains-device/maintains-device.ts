import { PhotoViewer } from '@ionic-native/photo-viewer';
import { MutilService } from '../../../../providers/util/Mutil.service';
import { Component, Inject } from '@angular/core';
import {
  NavController,
  NavParams,
  ActionSheetController,
  ModalController,
  Platform,
  AlertController,
  PopoverController,
} from 'ionic-angular';
import { CommonInputPage } from '../../../util/modal/common-input/common-input';
import { CommonTextareaPage } from '../../../util/modal/common-textarea/common-textarea';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PluginService } from '../../../../providers/util/plugin.service';
import { ImagePicker } from '@ionic-native/image-picker';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { APP_CONFIG, AppConfig } from '../../../../models/app-config';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DefectManagementDetailsPage } from '../../defect-management-details/defect-management-details';
import { MaintainsPage } from '../../maintains/maintains';
import { MaintainsMoreMenuPage } from '../more-menu/more-menu';
import { MaintainsProvider } from '../../../../providers/maintains.service';
import { EquipmentMessage } from '../../../home/equipment-message/equipment.message';
import { DeviceArchivePage } from '../../../device-archive/device-archive';
import { InventorisPage } from '../../inventoris/inventoris';
import { CommonRadioTextareaPage } from '../../../util/modal/common-radio-textarea/common-radio-textarea';
import { MaintainsItemHisPage } from '../maintains-item-his/maintains-item-his';

declare const BMap;
/**
 * Generated class for the MaintainsDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-maintains-device',
  templateUrl: 'maintains-device.html',
})
export class MaintainsDevicePage {
  objInfo: any;
  objItems: any;
  fileBasePath: any;
  buttons = [];
  inspectionTime: string;
  longitude: any;
  latitude: any;
  objPermission: any;
  filePath: string;
  popover: any;
  itemGroups: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private camera: Camera,
    private pluginservice: PluginService,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private filePicker: IOSFilePicker,
    private mutilservice: MutilService,
    private alertCtrl: AlertController,
    private maintainsprovider: MaintainsProvider,
    private photoViewer: PhotoViewer,
    private popoverCtrl: PopoverController,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.fileBasePath = this.appConfig.fileEndpoint;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionDevicePage');
    this.objInfo = this.navParams.get('objInfo');
    this.objPermission = this.navParams.get('objPermission');

    this.itemGroups = this.objInfo.itemGroups;

    this.longitude = +this.objInfo.longitude;
    this.latitude = +this.objInfo.latitude;

    this.buttons = this.objInfo.objId
      ? [
        {
          buttonIcon: 'wo-delete.png',
          buttonText: '删除',
          buttonAction: 'delete',
        },
        {
          buttonIcon: 'wo-save.png',
          buttonText: '保存',
          buttonAction: 'save',
        },
        {
          buttonIcon: 'wo-defect.png',
          buttonText: '缺陷单',
          buttonAction: 'defect',
        },
      ]
      : [
        {
          buttonIcon: 'wo-save.png',
          buttonText: '保存',
          buttonAction: 'save',
        },
        {
          buttonIcon: 'wo-defect.png',
          buttonText: '缺陷单',
          buttonAction: 'defect',
        },
      ];
    if (!this.objInfo.objId) {
      this.inspectionTime = moment().format('YYYY-MM-DD HH:mm');
    }
    if (this.objInfo.updateTime) {
      this.inspectionTime = moment(this.objInfo.updateTime).format(
        'YYYY-MM-DD HH:mm'
      );
    }
  }

  openRadioTextarea(item) {
    const modal = this.modalCtrl.create(
      CommonRadioTextareaPage,
      {
        item: item,
      },
      {
        cssClass: 'commonModal commonRadioTextareaModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          item.itemValue = data.value;
          item.itemMemo = data.memo;
        }
      }
    });
    modal.present();
  }

  setItemValue(props, value) {
    if (props && props.length > 0) {
      const findedValue = _.find(props, (o) => o.first === value);
      return findedValue && findedValue.second;
    }
    return null;
  }

  openSheetModal(item) {
    let buttons = [];
    if (item) {
      const options = item.props;
      buttons = options.map((option) => {
        return {
          text: option.second,
          handler: () => {
            item.itemValue = option.second;
          },
        };
      });
    } else {
      const options = this.objInfo.status;
      buttons = options.map((option) => {
        return {
          text: option.second,
          handler: () => {
            this.objInfo.inspectionStatus = option.first;
            this.objInfo.inspectionStatusText = option.second;
          },
        };
      });
    }

    const actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: buttons,
      cssClass: 'commonSheet',
    });
    actionSheet.present();
  }

  openInputModal(item, type?) {
    const modal = this.modalCtrl.create(
      CommonInputPage,
      {
        value: item.itemValue,
        title: item.itemName,
        type: type,
      },
      {
        cssClass: 'commonModal commonInputModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        item.itemValue = data.value;
      }
    });
    modal.present();
  }

  openTextarea(item) {
    const modal = this.modalCtrl.create(
      CommonTextareaPage,
      {
        title: item.itemName,
        value: item.itemValue,
      },
      {
        cssClass: 'commonModal commonTextareaModal',
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.type === 'ok') {
          item.itemValue = data.value;
        }
      }
    });
    modal.present();
  }

  chooseType(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.takePhoto(item);
          },
        },
        {
          text: '从相册选择',
          handler: () => {
            this.upload(item);
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

  takePhoto(item) {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: false,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
    };

    this.camera.getPicture(options).then(
      (image) => {
        // this.avatar = image.slice(7);
        this.pluginservice
          .uploadPic(image, '/api/m/v2/maintains/obj/file', 'file', {
            objItemId: item.objItemId,
          })
          .then((res: any) => {
            item.docs = item.docs || [];
            item.docs.push(res.data);
            this.mutilservice.popToastView('上传成功');
          });
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  upload(item) {
    // if (this.platform.is('android')) {
    this.imagePicker
      .getPictures({ maximumImagesCount: 1, width: 200, height: 200 })
      .then(
        (results) => {
          this.pluginservice
            .uploadPic(results[0], '/api/m/v2/maintains/obj/file', 'file', {
              objItemId: item.objItemId,
            })
            .then((res: any) => {
              item.docs = item.docs || [];
              item.docs.push(res.data);
              this.mutilservice.popToastView('上传成功');
            });
        },
        (err) => { }
      );
    //   } else {
    //   this.filePicker
    //     .pickFile()
    //     .then((uri) => {
    //       this.pluginservice
    //         .uploadPic(uri, '/api/m/v2/maintains/obj/file', 'file', {
    //           objItemId: item.objItemId,
    //         })
    //         .then((res: any) => {
    //           this.mutilservice.popToastView('上传成功');
    //           item.docs = item.docs || [];
    //           item.docs.push(res);
    //         });
    //     })
    //     .catch((err) => console.log('Error', err));
    // }
  }

  deleteDoc(item, docIds) {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定删除该照片吗?',
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
            this.pluginservice.deleteDoc(docIds).subscribe((res) => {
              _.remove(item.docs, (o) => {
                return o.docId === docIds;
              });
              console.log(item.docs);
              this.mutilservice.popToastView('删除成功');
            });
          },
        },
      ],
    });
    confirm.present();
  }

  buttonFunction(action) {
    if (action === 'delete') {
      this.deleteFunction();
    } else if (action === 'save') {
      this.saveFunction();
    } else if (action === 'defect') {
      this.navCtrl.push(DefectManagementDetailsPage, {
        deviceId: this.objInfo.deviceId,
        parentOrderId: this.objInfo.inspectionId,
      });
    }
  }

  saveFunction() {
    for (const groupsKey in this.itemGroups) {
      if (this.itemGroups.hasOwnProperty(groupsKey)) {
        if (groupsKey === 'item') {
          const itemGroup = this.itemGroups[groupsKey];
          for (const key in itemGroup) {
            if (itemGroup.hasOwnProperty(key)) {
              const element = itemGroup[key];
              if (!element.nullable) {
                if (element.itemType !== '06' && !element.itemValue) {
                  let alert = this.alertCtrl.create({
                    title: '警告',
                    subTitle: element.itemName + '字段不能为空',
                    buttons: ['关闭'],
                  });
                  alert.present();
                  return;
                } else if (
                  element.itemType === '06' &&
                  element.docs &&
                  element.docs.length === 0
                ) {
                  let alert = this.alertCtrl.create({
                    title: '警告',
                    subTitle: element.itemName + '字段不能为空',
                    buttons: ['关闭'],
                  });
                  alert.present();
                  return;
                }
              }
            }
          }
        }
      }
    }
    if (!this.objInfo.inspectionStatusText) {
      let alert = this.alertCtrl.create({
        title: '警告',
        subTitle: '巡检结果必填',
        buttons: ['关闭'],
      });
      alert.present();
      return;
    }
    const params = {
      ...this.objInfo,
      longitude: this.longitude,
      latitude: this.latitude,
    };
    if (params.itemGroups && params.itemGroups.length > 0) {
      params.itemGroups.map((itemGroup) => {
        if (itemGroup.items && itemGroup.items.length > 0) {
          itemGroup.items.map((item) => {
            item.props = null;
          });
        }
      });
    }
    params.status = null;
    this.maintainsprovider.saveObj(params).subscribe((res) => {
      if (this.objInfo.objId) {
        this.navCtrl.getPrevious().data.objInfo = {
          type: 'edit',
          params,
        };
      } else {
        this.navCtrl.getPrevious().data.objInfo = {
          type: 'add',
          params: { ...params, objId: res },
        };
      }

      this.navCtrl.pop();
    });
  }

  deleteFunction() {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定要删除此设备吗?',
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
            this.maintainsprovider
              .deleteObj(this.objInfo.objId)
              .subscribe((res) => {
                this.mutilservice.popToastView('删除成功');
                this.navCtrl.getPrevious().data.objInfo = {
                  type: 'delete',
                  params: {
                    objId: this.objInfo.objId,
                    objGroup: this.objInfo.objGroup,
                  },
                };
                this.navCtrl.pop();
              });
          },
        },
      ],
    });
    confirm.present();
  }

  buttonFlex(length) {
    switch (length) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-6';
      case 3:
        return 'col-4';
      case 4:
        return 'col-3';
      default:
        break;
    }
  }

  viewPic(url) {
    this.photoViewer.show(url);
  }

  //新增巡检单
  public openMoreMenu(myEvent) {
    this.popover = this.popoverCtrl.create(
      MaintainsMoreMenuPage,
      {},
      {
        cssClass: 'maintainsMenus',
        showBackdrop: true,
      }
    );
    this.popover.onDidDismiss((res) => {
      if (res) {
        switch (res.type) {
          case 1:
            this.navCtrl.push(MaintainsPage, {
              type: 'view',
              params: {
                stationId: this.objInfo.stationId,
                stationName: this.objInfo.stationName,
                deviceName: this.objInfo.deviceName,
                deviceId: this.objInfo.deviceId,
                startTime: moment().subtract(1, 'year').format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD'),
              },
            });
            break;
          case 2:
            this.navCtrl.push(EquipmentMessage, {
              deviceId: this.objInfo.deviceId,
            });
            break;
          case 3:
            this.navCtrl.push(DeviceArchivePage, {
              deviceId: this.objInfo.deviceId,
            });
            break;
          case 4:
            this.navCtrl.push(InventorisPage, {
              equipment: {
                deviceId: this.objInfo.deviceId,
                deviceName: this.objInfo.deviceName,
              },
              stationId: this.objInfo.stationId,
              stationName: this.objInfo.stationName,
            });
            break;

          default:
            break;
        }
      }
    });
    this.popover.present({
      ev: myEvent,
    });
  }

  itemHis(event, item) {
    event.stopPropagation && event.stopPropagation();
    this.navCtrl.push(MaintainsItemHisPage, {
      pageTitle: item.itemGroup,
      psrId: this.objInfo.psrId,
      itemId: item.itemId,
    });
  }
}
