import { MutilService } from './util/Mutil.service';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class HomeService {
  private homeinfoUrl: string;
  private searchUrl: string;
  private searchHistoryUrl: string;
  private alarmNoticeUrl: string;
  private modulesUrl: string;
  private qrsearchUrl: string;
  deviceInfoUrl: string;
  reportProductionMonthlyLyUrl: string;
  constructor(
    public http: AuthHttpService,
    private mutilservice: MutilService,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.homeinfoUrl = this.appConfig.apiEndpoint + '/api/m/v2/home/homeinfo';
    this.searchUrl = this.appConfig.apiEndpoint + '/api/m/v2/search';
    this.searchHistoryUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/search/searchHistory';
    this.modulesUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/framework/modules';
    this.alarmNoticeUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/alarmlogs/alarmNotice';
    this.qrsearchUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/framework/qrsearch';
    this.deviceInfoUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/device/deviceInfo';
    this.reportProductionMonthlyLyUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/report/production/monthly/ly';
  }

  /**
   * 首页数据接口
   */
  public gethomeinfo(params): Observable<Object[]> {
    let url = this.homeinfoUrl + (params ? '?regionDatas=true' : '');
    return this.http.get(url);
  }

  /**
   * 全局搜索接口
   */
  searchInfo(searchType: string, text: string, page: number) {
    let url =
      this.searchUrl +
      '?searchType=' +
      searchType +
      '&text=' +
      text +
      '&size=10' +
      '&page=' +
      page;
    return this.http.get(url);
  }
  /**
   * 全局搜索历史接口
   */
  searchHistoryInfo() {
    let url = this.searchHistoryUrl;
    return this.http.get(url);
  }
  /**
   * 首页可配置功能图标
   */
  public modules(): Observable<any[]> {
    let url = this.modulesUrl;
    return this.http.get(url);
  }

  alarmNoticeInfo() {
    let url = this.alarmNoticeUrl;
    return this.http.get(url);
  }

  /**
   * name
   */
  public getReportProductionMonthlyLy(params) {
    let url = this.reportProductionMonthlyLyUrl;
    return this.http.get(url, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }
}
