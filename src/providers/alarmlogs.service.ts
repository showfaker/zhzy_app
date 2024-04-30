import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class alarmlogsService {
    private alarmlogsUrl: string;
    private alarmcheckUrl: string;
    private alarmCountUrl: string;
    private alarmlogsInitUrl: string;
    private alarmlogsDetailUrl: string;
    checkmemosUrl: string;
    constructor(public http: AuthHttpService, @Inject(APP_CONFIG) public appConfig: AppConfig) {
        this.alarmlogsUrl = this.appConfig.apiEndpoint + '/api/m/v2/alarmlogs';
        this.alarmlogsDetailUrl = this.appConfig.apiEndpoint + '/api/m/v2/alarmlogs/detail';
        this.alarmlogsInitUrl = this.appConfig.apiEndpoint + '/api/m/v2/alarmlogs/init';
        this.alarmcheckUrl = this.appConfig.apiEndpoint + '/api/m/v2/alarmlogs/alarmCheck';
        this.alarmCountUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/alarmCount';
        this.checkmemosUrl = this.appConfig.apiEndpoint + '/api/m/v2/alarmlogs/checkmemos';
    }

    /**
     * 告警数量
     */
    public getAlarmCount(stationId: string) {
        let url = this.alarmCountUrl + '?stationId=' + stationId;
        return this.http.get(url);
    }

    /**
     * 告警列表
     */
    public getalarmlogs(params: {
        startDate: string;
        endDate: string;
        stationId?: string;
        deviceId?: string;
        alarmLevels?: string;
        alarmTypes?: string;
        alarmStatus?: string;
    }): Observable<Object> {
        let url = this.alarmlogsUrl + '?';
        for (let param in params) {
            if (params[param]) {
                url = url + param + '=' + params[param] + '&';
            }
        }
        url = url.substr(0, url.length - 1);
        return this.http.get(url);
    }
    /**
     * 告警详情
     */
    public getalarmlogsDetail(logId: string): Observable<Object> {
        let url = this.alarmlogsDetailUrl + '/' + logId;
        return this.http.get(url);
    }
    /**
     * 告警详情
     */
    public getCheckmemos(ruleId: string): Observable<Object> {
        let url = this.checkmemosUrl + '?ruleId=' + ruleId;
        return this.http.get(url);
    }

    /**
     * 告警初始化查询信息
     */
    public getalarmlogsInit(): Observable<Object> {
        let url = this.alarmlogsInitUrl;
        return this.http.get(url);
    }

    /**
     * 告警处理
     */
    public handelalarmcheck(logId: string, memo: string): Observable<Object> {
        let url = this.alarmcheckUrl + '?logId=' + logId + '&memo=' + memo;
        return this.http.post(url, {});
    }
}
