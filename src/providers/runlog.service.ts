import { ResponseContentType } from '@angular/http';
import { AppConfig, APP_CONFIG } from './../models/app-config';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthHttpService } from './auth-http.service';
import { RunlogReq } from '../models/runlog-req';
import { RunlogResp } from '../models/runlog-resp';
import { PrepLogDetailResp } from '../models/prev-log-detail-resp';

/**
 * 运行日志
 */
@Injectable()
export class RunLogService {
  private listLogsUrl: string;
  private delLogUrl: string;
  private addLogUrl: string;
  private updateLogUrl: string;
  private logDetailUrl: string;
  private prevLogDetailUrl: string;
  recordsListUrl: string;
  getRecordUrl: string;
  saveRecordUrl: string;
  deleteRecordUrl: string;
  getJobRecordsUrl: string;
  jobRecordsApiUrl: string;
  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.listLogsUrl = this.appConfig.apiEndpoint + '/api/jobRecord/jobRecords';
    this.delLogUrl =
      this.appConfig.apiEndpoint + '/api/jobRecord/deleteJobRecord';
    this.addLogUrl = this.appConfig.apiEndpoint + '/api/jobRecord/addJobRecord';
    this.updateLogUrl =
      this.appConfig.apiEndpoint + '/api/jobRecord/updateJobRecord';
    this.logDetailUrl = this.appConfig.apiEndpoint + '/api/jobRecord/jobRecord';
    this.prevLogDetailUrl =
      this.appConfig.apiEndpoint + '/api/jobRecord/getAddjobRecord';
    // 查询日志列表
    this.recordsListUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/jobRecord/records';
    // 查询日志列表
    this.getRecordUrl = this.appConfig.apiEndpoint + '/api/m/v2/jobRecord';
    this.getJobRecordsUrl = this.appConfig.apiEndpoint + '/api/v2/jobRecords';
    this.jobRecordsApiUrl =
      this.appConfig.apiEndpoint + '/api/v2/jobRecords/init';
    this.saveRecordUrl = this.appConfig.apiEndpoint + '/api/m/v2/jobRecord';
    this.deleteRecordUrl = this.appConfig.apiEndpoint + '/api/m/v2/jobRecord';
  }
  /**
   * 日志列表
   * @param stationId
   * @param startTime
   * @param endTime
   * @param page
   * @param size
   */
  public listLog(
    stationId: string,
    startTime: string,
    endTime: string,
    page: number,
    size: number
  ): Observable<RunlogResp> {
    let url =
      this.listLogsUrl +
      '?stationId=' +
      stationId +
      '&recordTypes=01&startTime=' +
      startTime +
      '&endTime=' +
      endTime +
      '&page=' +
      page +
      '&size=' +
      size;
    return this.http.get(url);
  }
  /**
   * 单个日志详细信息
   * @param recordId
   */
  public logDetail(recordId: number): Observable<RunlogReq> {
    let url = this.logDetailUrl + '?recordId=' + recordId;
    return this.http.get(url);
  }
  /**
   * 上一条日志详细信息
   * @param recordId
   * @param reportDate
   */
  public prevLogDetail(
    stationId: string,
    endDate: string
  ): Observable<PrepLogDetailResp> {
    let url =
      this.prevLogDetailUrl + '?stationId=' + stationId + '&endDate=' + endDate;
    return this.http.get(url);
  }
  /**
   * 新增日志
   * @param runlog
   */
  public addLog(runlog: RunlogReq): Observable<RunlogReq> {
    return this.http.post(this.addLogUrl, runlog);
  }
  /**
   * 更新日志
   * @param runlog
   */
  public updateLog(runlog: RunlogReq): Observable<RunlogReq> {
    return this.http.put(this.updateLogUrl, runlog);
  }
  /**
   * 删除日志
   * @param recordId
   */
  public delLog(recordId: number) {
    let url = this.delLogUrl + '?recordId=' + recordId;
    return this.http.delete(url);
  }

  public getRecordsList(params) {
    let url =
      this.recordsListUrl +
      '?' +
      (params.stationId ? 'stationId=' + params.stationId + '&' : '') +
      'startTime=' +
      params.startTime +
      '&endTime=' +
      params.endTime +
      '&status=' +
      params.status +
      '&page=' +
      params.page +
      '&size=' +
      params.size;
    return this.http.get(url);
  }

  public getRecord(recordId, stationId) {
    let url =
      this.getRecordUrl +
      '/' +
      recordId +
      (recordId === 0 ? '?stationId=' + stationId : '');
    return this.http.get(url);
  }
  public getJobRecords(recordId, stationId?): any {
    let url =
      this.getJobRecordsUrl +
      '/' +
      recordId +
      (recordId === 0 ? '?stationId=' + stationId : '');
    return this.http.get(url).toPromise();
  }

  public jobRecordsInit(params) {
    return this.http
      .get(`${this.jobRecordsApiUrl}`, {
        params,
      })
      .toPromise();
  }

  public saveRecord(params) {
    let url = this.saveRecordUrl;
    return this.http.post(url, params, {
      responseType: ResponseContentType.Text,
    });
  }

  public updateRecord(params) {
    let url = this.saveRecordUrl;
    return this.http.put(url, params, {
      responseType: ResponseContentType.Text,
    });
  }

  public deleteRecord(recordId) {
    let url = this.deleteRecordUrl + '?recordId=' + recordId;
    return this.http.delete(url, { responseType: 0 });
  }

  public getNemsProp(typeId: string): Promise<any[]> {
    return this.http
      .get(`${this.appConfig.apiEndpoint}/api/prop`, { params: { typeId } })
      .toPromise();
  }

  public updateJobRecords(params) {
    return this.http
      .put(`${this.appConfig.apiEndpoint}/api/v2/jobRecords`, params)
      .toPromise();
  }
  public saveJobRecords(params) {
    return this.http
      .post(`${this.appConfig.apiEndpoint}/api/v2/jobRecords`, params)
      .toPromise();
  }
}
