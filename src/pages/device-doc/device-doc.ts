import { MutilService } from './../../providers/util/Mutil.service';
import { PluginService } from './../../providers/util/plugin.service';
import { QrSearchService } from './../../providers/qr-search.service';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { APP_CONFIG, AppConfig } from '../../models/app-config';

/**
 * Generated class for the DeviceDocPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-device-doc',
    templateUrl: 'device-doc.html',
})
export class DeviceDocPage {
    deviceId: any;
    deviceName: any;
    DDVList: any = [];
    DMDList: any = [];
    DCLList: any = [];
    fileTypeList: any[];
    downloadUrl: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private qrsearchservice: QrSearchService,
        private pluginservice: PluginService,
        private mutilservice: MutilService,
        @Inject(APP_CONFIG) public appConfig: AppConfig
    ) {
        this.downloadUrl = this.appConfig.apiEndpoint + '/api/doc/download';
    }

    ionViewDidLoad() {
        this.deviceId = this.navParams.get('deviceId');
        this.deviceName = this.navParams.get('deviceName');
        this.qrsearchservice.getDeviceDocs(this.deviceId).subscribe((res) => {
            if (res) {
                this.fileTypeList = [
                    { name: 'DDV', value: res.DDV },
                    { name: 'DMD', value: res.DMD },
                    { name: 'DCL', value: res.DCL },
                ];
            }
        });
    }

    download(docId, docName) {
        this.mutilservice.customPrompt({ msg: '确定下载该文件吗?' }, () => {
            this.pluginservice.downloadFile(this.downloadUrl + '?docId=' + docId, docName);
        });
    }
}
