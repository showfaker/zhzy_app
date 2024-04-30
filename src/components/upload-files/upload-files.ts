import { Platform } from 'ionic-angular';
import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
import { PluginService } from '../../providers/util/plugin.service';
import { MutilService } from '../../providers/util/Mutil.service';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import * as _ from 'lodash';
/**
 * Generated class for the UploadFilesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'upload-files',
  templateUrl: 'upload-files.html',
})
export class UploadFilesComponent {
  @Input() orderId = null;
  @Output() public docsEvent = new EventEmitter<any>();
  fileBasePath: any;
  @Input() docs = [];
  @Input() docPermission = 2;
  downloadUrl: string;
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private pluginservice: PluginService,
    private mutilservice: MutilService,
    private platform: Platform,
    private fileChooser: FileChooser,
    private filePicker: IOSFilePicker
  ) {
    console.log('Hello UploadFilesComponent Component');
    this.downloadUrl = this.appConfig.apiEndpoint + '/api/doc/download';
  }

  upload() {
    if (this.platform.is('android')) {
      this.fileChooser
        .open()
        .then((uri) => {
          this.pluginservice
            .uploadDoc(
              uri,
              this.orderId
                ? '/api/workOrders/uploadDocs?orderId=' + this.orderId
                : '/api/workOrders/uploadDocs'
            )
            .then((res: any) => {
              this.docs.push(res);
              this.docsEvent.emit(this.docs);
              this.mutilservice.popToastView('上传成功');
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((e) => console.log(e));
    } else {
      this.filePicker
        .pickFile()
        .then((uri) => {
          this.pluginservice
            .uploadDoc(
              uri,
              this.orderId
                ? '/api/workOrders/uploadDocs?orderId=' + this.orderId
                : '/api/workOrders/uploadDocs'
            )
            .then((res: any) => {
              this.docs.push(res.data);
              this.docsEvent.emit(this.docs);
              this.mutilservice.popToastView('上传成功');
            });
        })
        .catch((err) => console.log('Error', err));
    }
  }

  download(docId, docName) {
    this.mutilservice.customPrompt({ msg: '确定下载该文件吗?' }, () => {
      this.pluginservice.downloadFile(this.downloadUrl + '?docId=' + docId, docName);
    });
  }

  deleteDoc(docId) {
    this.pluginservice.deleteDoc(docId).subscribe((res) => {
      _.remove(this.docs, function (img) {
        return img.docId === docId;
      });
      this.mutilservice.popToastView('删除成功');
    });
  }

  decodeFileName(filename) {
    return decodeURI(filename);
  }
}
