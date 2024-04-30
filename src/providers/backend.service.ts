import { AppConfig, APP_CONFIG } from './../models/app-config';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AuthHttpService } from './auth-http.service';
import { StationPointsResp } from '../models/station-points-resp';
import { SampleStationsResp } from './../models/sample-stations-resp';
import { StationRankingResp } from '../models/station-ranking-resp';
import { GroupInfoResp } from '../models/group-info-resp';

@Injectable()
export class BackendService {
    private stationPointsUrl: string;
    private stationRankingUrl: string;
    private sampleStationsUrl: string;
    private singleStationRankingUrl: string;
    private groupInfoUrl: string;
    private groupStationInfoUrl: string;
    private deviceInfoUrl: string;
    private devicePointsUrl: string;
    propsUrl: string;

    constructor(
        public http: AuthHttpService,
        @Inject(APP_CONFIG) public appConfig: AppConfig
    ) {
        this.stationPointsUrl =
            this.appConfig.apiEndpoint + '/api/points/stationPoints';
        this.stationRankingUrl =
            this.appConfig.apiEndpoint + '/api/station/ranking';
        this.sampleStationsUrl =
            this.appConfig.apiEndpoint + '/api/station/getSampleStations';
        this.singleStationRankingUrl =
            this.appConfig.apiEndpoint + '/api/device/ranking';
        this.groupInfoUrl =
            this.appConfig.apiEndpoint + '/api/v1/monitor/group';
        this.groupStationInfoUrl =
            this.appConfig.apiEndpoint + '/api/v1/monitor/station';
        /******************************************** 设备信息 **********************************************************************************************/
        this.deviceInfoUrl =
            this.appConfig.apiEndpoint + '/api/device/deviceInfo';
        this.devicePointsUrl = this.appConfig.apiEndpoint + '/api/points';

        this.propsUrl = this.appConfig.apiEndpoint + '/api/m/v2/props';
    }

    /******************************************** 集团信息 **********************************************************************************/

    /**
     * 监视页面顶部的信息集团
     */
    groupInfoResp: GroupInfoResp;
    public getGroupInfo(): Promise<GroupInfoResp> {
        if (this.groupInfoResp) {
            return Promise.resolve(this.groupInfoResp);
        }
        return this.http
            .get(this.groupInfoUrl)
            .toPromise()
            .then((e) => {
                if (e) {
                    this.groupInfoResp = e;
                }
                return e;
            });
    }

    /**
     * 集团电站监视数据
     * @param cateId 时间周期
     * 小时：A-ENERGY-HOUR日：A-ENERGY-DAY月：A-ENERGY-MON年：A-ENERGY-YEAR
     * @param beginTime 开始时间
     * @param endTime 结束时间
     */
    public stationPointsGroup(
        cateId: string,
        beginTime: Date,
        endTime: Date
    ): Observable<StationPointsResp> {
        let url =
            this.stationPointsUrl +
            '?&cateIds=' +
            cateId +
            '&beginTime=' +
            beginTime.toUTCString() +
            '&endTime=' +
            endTime.toUTCString();
        return this.http.get(url);
    }

    /**
     * 发电站排行
     * @param cateId 时间周期
     * 小时：A-ENERGY-HOUR日：A-ENERGY-DAY月：A-ENERGY-MON年：A-ENERGY-YEAR
     */
    public stationRanking(
        cateId: string,
        sort: string,
        page?: number
    ): Observable<StationRankingResp> {
        if (!page) {
            page = 0;
        }
        // let url = this.stationRankingUrl+"?cateIds="+cateId+"&page=0&size="+((page+1) * 1000)+"&sort=" + sort;
        let url =
            this.stationRankingUrl +
            '?cateIds=' +
            cateId +
            '&page=' +
            page +
            '&size=1000&sort=' +
            sort;
        return this.http.get(url);
    }

    /********************************************* 电站信息 ****************************************************************************************/

    /**
     * 监视页面顶部的信息 单电站
     */
    public getGroupStationInfoUrl(
        stationId: string
    ): Observable<GroupInfoResp> {
        return this.http.get(
            this.groupStationInfoUrl + '?stationId=' + stationId
        );
    }

    /**
     * 单个电站监视数据
     * @param stationId 电站ID
     * @param cateId 时间周期
     * 小时：A-ENERGY-HOUR日：A-ENERGY-DAY月：A-ENERGY-MON年：A-ENERGY-YEAR
     * @param beginTime 开始时间
     * @param endTime 结束时间
     * @param 升序 倒序
     */
    public stationPointsSingle(
        stationId: string,
        cateId: string,
        beginTime: Date,
        endTime: Date
    ): Observable<StationPointsResp> {
        let url =
            this.stationPointsUrl +
            '?&stationIds=' +
            stationId +
            '&cateIds=' +
            cateId +
            '&beginTime=' +
            beginTime.toUTCString() +
            '&endTime=' +
            endTime.toUTCString();
        return this.http.get(url);
    }

    /**
     * 单电站时排名
     * @param stationId
     * @param cateIds
     * @param sort
     */
    public getSingleStationRankingUrl(
        stationId: string,
        cateIds: string,
        sort: string,
        page?: number
    ): Observable<SampleStationsResp> {
        if (!page) {
            page = 0;
        }
        // let url = this.singleStationRankingUrl+"?stationId="+stationId+"&cateIds="+cateIds+"&page=0&size="+((page+1) * 1000)+"&deviceType=NB&sort=" + sort;
        let url =
            this.singleStationRankingUrl +
            '?stationId=' +
            stationId +
            '&cateIds=' +
            cateIds +
            '&page=' +
            page +
            '&size=1000&deviceType=NB&sort=' +
            sort;
        return this.http.get(url);
    }

    /******************************************** 设备信息 **********************************************************************************************/
    /**
     * 设备头部信息
     */
    public getDeviceInfo(deviceId: string): Observable<StationPointsResp> {
        let url = this.deviceInfoUrl + '?&deviceId=' + deviceId;
        return this.http.get(url);
    }

    /**
     * 设备发电趋势
     * @param deviceId
     * @param cateIds
     * @param beginTime
     * @param endTime
     */
    public getDevicePointsUrl(
        deviceId: string,
        cateIds: string,
        beginTime: Date,
        endTime: Date
    ) {
        let url =
            this.devicePointsUrl +
            '?&objType=02&getHisValues=true&objIds=' +
            deviceId +
            '&cateIds=' +
            cateIds +
            '&beginTime=' +
            beginTime.toUTCString() +
            '&endTime=' +
            endTime.toUTCString();
        return this.http.get(url);
    }
    /**
     * 测点列表
     */
    public getDevicePointsListUrl(deviceId: string) {
        let url =
            this.devicePointsUrl +
            '?&objType=02&getCurrValue=true&getHisValues=false&objIds=' +
            deviceId;
        return this.http.get(url);
    }

    /**
     * 电站列表
     */
    public getSampleStations(): Observable<SampleStationsResp> {
        return this.http.get(this.sampleStationsUrl);
    }

    /**
     * getProps
     */
    public getProps(params) {
        let url = this.propsUrl;
        const paramsArray = [];
        Object.keys(params).forEach(
            (key) => params[key] && paramsArray.push(`${key}=${params[key]}`)
        );
        if (url.search(/\?/) === -1) {
            url += `?${paramsArray.join('&')}`;
        } else {
            url += `&${paramsArray.join('&')}`;
        }
        return this.http.get(url);
    }
}
