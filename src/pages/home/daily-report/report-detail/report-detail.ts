import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {} from 'ionic-angular/navigation/nav-params';
import { DailyReportService } from '../../../../providers/dailyreport.service';
import { MutilService } from '../../../../providers/util/Mutil.service';

@Component({
  selector: 'report-detail',
  templateUrl: 'report-detail.html',
})
export class ReportDetail {
  public stationGroup: string = 'previous';
  public stationPart: string = 'previous';
  public reportDetail;
  public preYearByGroup;
  public thisYearByGroup;
  public allYearByGroup;
  public preYearByPart;
  public thisYearByPart;
  public allYearByPart;
  public preData;
  public thisData;
  public allData;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mutil: MutilService,
    public dailyReportService: DailyReportService
  ) {}

  ionViewWillEnter() {
    console.log(this.navParams.data.date.date);
    this.getReportDetail();
  }

  getReportDetail() {
    this.dailyReportService
      .getReportDetail(this.navParams.data.date.date)
      .subscribe((e) => {
        this.reportDetail = e;
        console.log(e);
      });

    this.dailyReportService
      .getGroupProgress(this.navParams.data.date.date)
      .subscribe((e) => {
        console.log(e);
        this.preYearByGroup = e.preYears;
        this.thisYearByGroup = e.thisYear;
        this.allYearByGroup = e.all;
      });

    this.dailyReportService
      .getPartProgress(this.navParams.data.date.date)
      .subscribe((e) => {
        this.preYearByPart = e.preYears;
        this.thisYearByPart = e.thisYear;
        this.allYearByPart = e.all;
        // this.preData = e.preYears.data.map((value,index) => {
        //     return value.data;
        // })
      });
  }
}
