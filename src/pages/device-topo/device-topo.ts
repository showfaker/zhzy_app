import { QrSearchService } from './../../providers/qr-search.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import echarts from 'echarts';
import { buildDeviceTopo } from './device-topo.chart';
/**
 * Generated class for the DeviceTopoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-device-topo',
  templateUrl: 'device-topo.html'
})
export class DeviceTopoPage {
  @ViewChild('echart') echart;
  deviceId: any;
  deviceName: any;
  options: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrsearchservice: QrSearchService
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceTopoPage');
    this.deviceId = this.navParams.get('deviceId');
    this.deviceName = this.navParams.get('deviceName');
    this.qrsearchservice.getDeviceTopo(this.deviceId).subscribe((res) => {
      if (res) {
        this.options = buildDeviceTopo(res, this.deviceId);
      }
    });
  }
}
