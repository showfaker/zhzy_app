import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';
import { MutilService } from './util/Mutil.service';
import { PluginService } from './util/plugin.service';

@Injectable()
export class ModulesService {
  private stationInitUrl: string;
  private dispersionInitUrl: string;
  private modulesListUrl: string;
  private groupDatasListUrl: string;
  private regionsUrl: string;
  private stationTypeUrl: string;
  private modules2Url: string;
  private deviceListInitUrl: string;
  private deviceListUrl: string;
  private lossLossTypesUrl: string;
  private lossStationLossTypesUrl: String;
  private lossDetailUrl: string;
  private exportStationLossTypesUrl: string;
  private exportStationLossTypesDetailsUrl: string;
  reportEnergyInitUrl: string;
  reportEnergyListUrl: string;
  constructor(
    public puginService: PluginService,
    public http: AuthHttpService,
    private mutil: MutilService,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.modules2Url =
      this.appConfig.apiEndpoint + '/api/m/v2/framework/modules2'; // 新首页模块列表

    this.stationInitUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/monitor/station/init'; // 新首页模块详情初始化
    this.dispersionInitUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/monitor/dispersion/init'; // 新首页模块运行效率详情初始化

    this.modulesListUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/monitor/station/'; // 功率监视等模块 数据列表
    this.groupDatasListUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/monitor/dispersion/groupDatas/'; // 运行效率 数据列表

    this.regionsUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/regions?parentId='; // 省列表

    this.stationTypeUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/props?typeId=stationType'; // 电站类型列表

    this.deviceListInitUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/monitor/device/init'; // 设备运行状态，设备通行状态初始化
    this.deviceListUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/monitor/device'; // 设备运行状态，设备通行状态列表
    this.lossLossTypesUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/report/loss/lossTypes'; //损失电量统计图标
    this.lossStationLossTypesUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/report/loss/stationLossTypes'; //损失电量统计列表
    this.lossDetailUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/report/loss/details'; //损失电量统计详情列表
    this.exportStationLossTypesUrl =
      this.appConfig.apiEndpoint +
      '/api/m/v2/report/loss/export/stationLossTypes'; //损失电量统计文件下载地址
    this.exportStationLossTypesDetailsUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/report/loss/export/details'; //损失电量统计详情文件下载地址
    this.reportEnergyInitUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/report/energy/init'; //电量报表初始化
    this.reportEnergyListUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/report/energy'; //电量报表列表
  }

  /**拼接图片路径 */
  getImg(imgName) {
    return this.appConfig.fileEndpoint + imgName;
  }

  modules2() {
    let url = this.modules2Url;
    return this.http.get(url);
  }

  /**
   * 新首页模块详情初始化接口
   * @param param 根据参数不同调用不同接口
   */
  modulesDetailsInit(param): Observable<any> {
    let url = '';

    switch (param) {
      case 'group':
        url = this.dispersionInitUrl;
        break;
      default:
        url = this.stationInitUrl;
    }
    url = url + '?data=' + param;
    return this.http.get(url);
  }

  /**
   * 新首页模块详情列表接口
   * @param param 根据参数不同调用不同接口
   */
  modulesList(param, data): Observable<any> {
    let url = '';
    switch (param) {
      case 'group':
        url = this.groupDatasListUrl + '?';
        break;
      default:
        url = this.modulesListUrl;
        url = url + param + '?';
    }

    if (data) {
      for (const key in data) {
        if (key && (data[key] || data[key] === 0)) {
          url = url + key + '=' + data[key] + '&';
        }
      }
      return this.http.get(url);
    }
  }

  public getModuleChart(param, data) {
    let url = '';
    switch (param) {
      case 'group':
        url = this.groupDatasListUrl + '?';
        break;
      default:
        url = this.modulesListUrl;
        url = url + param + '/charts';
    }
    return this.http.get(url, { params: data });
  }

  /**
   * 查询省，市，县
   * @param parentId id若是省则默认为CN
   */
  regions(parentId?: string) {
    if (!parentId) {
      parentId = 'CN';
    }
    let url = this.regionsUrl + parentId;
    return this.http.get(url);
  }

  /**查询电站类型 */
  stationType() {
    let url = this.stationTypeUrl;
    return this.http.get(url);
  }

  /**
   * 设备运行状态初始化  data:runStatus
   * 设备通信状态初始化
   * @param data id若是省则默认为CN
   */
  deviceListInit(data: string, deviceType: string, stationId: string) {
    let url = this.deviceListInitUrl;
    url = `${url}?data=${data}&deviceType=${deviceType}&stationId=${stationId}`;
    // switch(data){
    //     case'runStatus':
    //         url = `${url}?data=${data}&deviceType=${deviceType}&stationId=${stationId}`
    //     break;
    //     default:

    // }

    return this.http.get(url);
  }

  /**
   * 设备运行状态初始化  data:runStatus
   * 设备通信状态初始化
   * @param param 运行状态或通行状态 参数不同
   * @param data id若是省则默认为CN
   */
  deviceList(param, data) {
    let url = this.deviceListUrl + '/' + param + '?';
    // switch(param){
    //     case'runStatus':
    //         url = this.deviceListUrl +'/' +  + '?';
    //     break;
    //     case'commuStatus':
    //         url = this.deviceListUrl + '?';
    //     break;

    // }

    if (data) {
      for (const key in data) {
        if (key && (data[key] || data[key] === 0)) {
          url = url + key + '=' + data[key] + '&';
        }
      }
      return this.http.get(url);
    }
  }

  /**
   * 损失电量统计列表
   * @param startDate 开始时间 默认一月
   * @param endDate 结束时间 默认当天
   * @param stationIds 电站id 可以不填
   */
  lossStationLossTypes(data) {
    let url = `${this.lossStationLossTypesUrl}?`;
    // if (stationIds) {
    //     url = `${url}&stationIds=${stationIds}`
    // }
    for (const key in data) {
      if (key && (data[key] || data[key] === 0)) {
        url = url + key + '=' + data[key] + '&';
      }
    }
    return this.http.get(url);
  }

  /**
   * 损失电量统计图标
   * @param startDate 开始时间 默认一月
   * @param endDate 结束时间 默认当天
   * @param stationIds 电站id 可以不填
   */
  lossLossTypes(data) {
    let url = `${this.lossLossTypesUrl}?`;
    // if (stationIds) {
    //     url = `${url}&stationIds=${stationIds}`
    // }
    for (const key in data) {
      if (key && (data[key] || data[key] === 0)) {
        url = url + key + '=' + data[key] + '&';
      }
    }
    return this.http.get(url);
  }

  /**
   * 损失电量统计列表
   * @param data
   */
  lossDetail(data) {
    let url = `${this.lossDetailUrl}?`;
    // if (stationIds) {
    //     url = `${url}&stationIds=${stationIds}`
    // }
    for (const key in data) {
      if (key && (data[key] || data[key] === 0)) {
        url = url + key + '=' + data[key] + '&';
      }
    }
    return this.http.get(url);
  }

  /**
   * 损失电量统计文件下载地址
   */
  exportStationLossTypes(data, docName) {
    console.log('下载文件名：', docName);
    let url = `${this.exportStationLossTypesUrl}?`;

    for (const key in data) {
      if (key && (data[key] || data[key] === 0)) {
        url = url + key + '=' + data[key] + '&';
      }
    }
    this.puginService.downloadFile(url, docName);
  }

  /**
   * 损失电量统计详情文件下载地址
   */
  exportStationLossTypesDetails(data, docName) {
    console.log('下载文件名：', docName);
    let url = `${this.exportStationLossTypesDetailsUrl}?`;

    for (const key in data) {
      if (key && (data[key] || data[key] === 0)) {
        url = url + key + '=' + data[key] + '&';
      }
    }
    this.puginService.downloadFile(url, docName);
  }

  public reportEnergyInit() {
    return this.http.get(this.reportEnergyInitUrl);
  }

  public reportEnergyList(params) {
    return this.http.get(this.reportEnergyListUrl, {
      params: this.mutil.filterEffectParam(params),
    });
  }
}
