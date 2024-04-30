import { QrSearchService } from './../../providers/qr-search.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the DeviceArchivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-device-archive',
    templateUrl: 'device-archive.html'
})
export class DeviceArchivePage {
    deviceId: any;
    title: any;
    pic: any;
    form: any;
    toggleBaseInfo = true;
    showInfos: any;
    groups: any = {};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private qrsearchservice: QrSearchService
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad DeviceArchivePage');
        this.deviceId = this.navParams.get('deviceId');
        this.qrsearchservice.getDeviceInfo(this.deviceId).subscribe((res) => {
            this.title = res.title;
            this.pic = res.pic.substring(1);
            this.showInfos = res.infos;
        });
    }
    show(item, i) {
        console.log(item);
    }

    getKeys(item, groupName) {
        if (!this.groups[groupName]) {
            let arr = [];
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const element = item[key];
                    arr.push(element);
                }
            }
            this.groups[groupName] = _.orderBy(arr, ['orderNo'], ['asc']);
        }
        return this.groups[groupName];
    }
}
