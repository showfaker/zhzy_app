import {} from 'ionic-angular/navigation/nav-params';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MutilService } from '../../../providers/util/Mutil.service';
import { DailyReportService } from '../../../providers/dailyreport.service';
import { ReportDetail } from './report-detail/report-detail';

@Component({
  selector: 'daily-report',
  templateUrl: 'daily-report.html',
})
export class DailyReport {
  public reports;
  public page: number = 0;
  public size: number = 10;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mutil: MutilService,
    public dailyReportService: DailyReportService
  ) {}

  ionViewWillEnter() {
    this.getGroupreport();
  }

  getGroupreport() {
    this.dailyReportService.getReportList(this.page).subscribe((e) => {
      if (e && e['content'] && e['content'].length >= 0) {
        this.reports = e['content'];
        console.log(this.reports);
      }
    });
  }

  reportDetail(report) {
    this.navCtrl.push(ReportDetail, { date: report });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      infiniteScroll.complete();
      infiniteScroll.enable(false);
    }, 500);
  }
}
