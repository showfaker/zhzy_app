import { InspectionsProvider } from './../../../../providers/inspections.service';
import { MutilService } from './../../../../providers/util/Mutil.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InspectionItemHisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inspection-item-his',
  templateUrl: 'inspection-item-his.html',
})
export class InspectionItemHisPage {
  pageTitle: any;
  psrId: any;
  itemId: any;
  page: number = 0;
  size: number = 10;
  objItemHisList: any;
  canInfinite: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mutilservice: MutilService,
    private inspectionsprovider: InspectionsProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionItemHisPage');
    this.pageTitle = this.navParams.get('pageTitle');
    this.psrId = this.navParams.get('psrId');
    this.itemId = this.navParams.get('itemId');
    console.log(this.pageTitle, this.psrId, this.itemId);

    this.getItemhisList(true);
  }

  // 获取巡检列表
  getItemhisList(first, refresher?) {
    if (!refresher) {
      this.mutilservice.showLoading();
    }
    if (first) {
      this.page = 0;
    }
    const params = {
      psrId: this.psrId,
      itemId: this.itemId,
      page: this.page,
      size: this.size,
    };
    this.inspectionsprovider.getObjItemHis(params).subscribe((res) => {
      if (res) {
        this.objItemHisList = res.content;
      }
      if (refresher) refresher.complete();
      this.mutilservice.hideLoading();
    });
  }

  // 下拉刷新
  doRefresh(refresher: { complete: () => void }) {
    this.getItemhisList(true, refresher);
  }

  // 加载更多
  doInfinite(infiniteScroll: { complete: () => void }) {
    this.page++;
    const params = {
      psrId: this.psrId,
      itemId: this.itemId,
      page: this.page,
      size: this.size,
    };

    this.inspectionsprovider.getObjItemHis(params).subscribe((res) => {
      if (res && res.content.length > 0) {
        this.objItemHisList = this.objItemHisList.concat(res['content']);
      } else {
        this.page--;
      }
      if (this.objItemHisList.length >= res['totalElements']) {
        this.canInfinite = false;
      }
      infiniteScroll.complete();
    });
  }
}
