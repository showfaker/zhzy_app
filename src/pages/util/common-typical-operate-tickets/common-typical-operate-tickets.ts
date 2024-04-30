import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MutilService } from '../../../providers/util/Mutil.service';
import { OperateTicketsProvider } from './../../../providers/operate-tickets.service';

/**
 * Generated class for the CommonTypicalOperateTicketsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-typical-operate-tickets',
  templateUrl: 'common-typical-operate-tickets.html',
})
export class CommonTypicalOperateTicketsPage {
  page: number;
  stationId: any;
  operateDesc: any = null;
  operateTemplates: any;
  canInfinite: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private operateticketsservice: OperateTicketsProvider,
    private viewCtrl: ViewController,
    private mutilservice: MutilService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonTypicalOperateTicketsPage');

    this.stationId = this.navParams.get('stationId') || null;

    this.getOperateTemplates(true);
  }

  getOperateTemplates(first, refresher?) {
    if (first) {
      this.page = 0;
    }
    const params = {
      stationId: this.stationId,
      operateDesc: this.operateDesc,
      page: this.page,
      size: 10,
    };
    this.operateticketsservice.getOperateTemplates(params).subscribe((res) => {
      if (res) {
        this.operateTemplates = res.content;
      }
      if (refresher) refresher.complete();
      this.mutilservice.hideLoading();
    });
  }

  onCancel() {
    this.getOperateTemplates(true);
  }

  doRefresh(refresher) {
    this.getOperateTemplates(true, refresher);
  }

  clickItem(id) {
    this.viewCtrl.dismiss({
      type: 'ok',
      value: id,
    });
  }

  doInfinite(infiniteScroll: { complete: () => void }) {
    this.page++;
    let params = {
      stationId: this.stationId,
      operateDesc: this.operateDesc,
      page: this.page,
      size: 10,
    };
    this.operateticketsservice.getOperateTemplates(params).subscribe((res) => {
      if (res && res.content.length > 0) {
        this.operateTemplates = this.operateTemplates.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.operateTemplates.length >= res['totalElements']) {
        this.canInfinite = false;
      }

      infiniteScroll.complete();
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
