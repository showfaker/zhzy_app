import { MutilService } from './util/Mutil.service';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class MonitorService {
    private summaryUrl: string;
    private energiesUrl: string;
    private alarmCountUrl: string;
    private inverterrankUrl: string;
    private provincesUrl: string;
    private stationTypesUrl: string;
    private stationlistUrl: string;
    private equipmentListUrl: string;
    private equipmentTypeUrl: string;
    private equipmentAreaUrl: string;
    private equipmentInfoUrl: string;
    private deviceAlarmCountUrl: string;
    deviceClassesUrl: string;
    devicesListUrl: string;
    constructor(
        public http: AuthHttpService,
        @Inject(APP_CONFIG) public appConfig: AppConfig,
        private mutilservice: MutilService
    ) {
        this.summaryUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/summary'; // 获取页面上半部分信息
        this.energiesUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/energies'; // 获取发电曲线数据
        this.alarmCountUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/alarmCount'; // 获取电站告警数量
        this.inverterrankUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/inverterrank'; // 获取逆变器发电排行
        this.provincesUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/provinces'; // 电站区域查询条件
        this.stationTypesUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/stationTypes'; // 电站类型查询条件
        this.stationlistUrl = this.appConfig.apiEndpoint + '/api/m/v2/station/list'; // 电站类型查询条件
        this.equipmentListUrl = this.appConfig.apiEndpoint + '/api/m/v2/device/list'; //设备列表
        this.devicesListUrl = this.appConfig.apiEndpoint + '/api/m/v2/device/devices'; //设备列表
        this.equipmentTypeUrl = this.appConfig.apiEndpoint + '/api/m/v2/device/models'; //设备类型查询
        this.deviceClassesUrl = this.appConfig.apiEndpoint + '/api/m/v2/device/classes'; //设备类型查询
        this.equipmentAreaUrl = this.appConfig.apiEndpoint + '/api/m/v2/area/stationAreaList'; //设备区域查询
        this.equipmentInfoUrl = this.appConfig.apiEndpoint + '/api/m/v2/device/monitor'; //设备监视信息
        this.deviceAlarmCountUrl = this.appConfig.apiEndpoint + '/api/m/v2/device/alarmCount'; //设备告警
    }

    /**
     * 获取页面上半部分信息
     */
    public getsummary(stationId?: string): Observable<Object[]> {
        let url = this.summaryUrl;
        if (stationId) {
            url = url + '?stationId=' + stationId;
        }
        return this.http.get(url);
    }
    /**
     * 获取发电曲线数据
     */
    public getenergies(timeType: string, stationId?: string): Observable<Object[]> {
        let url = this.energiesUrl + '?timeType=' + timeType;
        if (stationId) {
            url = url + '&stationId=' + stationId;
        }
        return this.http.get(url);
    }
    /**
     * 获取电站告警数量
     */
    public getalarmCount(stationId: string): Observable<Object> {
        let url = this.alarmCountUrl + '?stationId=' + stationId;
        return this.http.get(url);
    }
    /**
     * 获取逆变器发电排行
     */
    public getinverterrankUrl(stationId: string, cateId: string, sort: string): Observable<Object> {
        let url =
            this.inverterrankUrl +
            '?stationId=' +
            stationId +
            '&cateId=' +
            cateId +
            '&sort=' +
            sort;
        return this.http.get(url);
    }
    /**
     * 电站区域查询条件
     */
    public getprovinces(): Observable<Object[]> {
        let url = this.provincesUrl;
        return this.http.get(url);
    }
    /**
     * 电站类型查询条件
     */
    public getstationTypes(): Observable<Object[]> {
        let url = this.stationTypesUrl;
        return this.http.get(url);
    }

    /**
     * 查询电站列表
     */
    public getstationlist(
        stationName: string,
        provinceIds: string,
        stationTypes: string,
        page: number
    ): Observable<Object> {
        let url =
            this.stationlistUrl +
            '?stationName=' +
            stationName +
            '&provinceIds=' +
            provinceIds +
            '&stationTypes=' +
            stationTypes +
            '&size=10' +
            '&page=' +
            page;
        return this.http.get(url);
    }

    /**
     * 查询设备列表
     */
    public getEquipmentList(
        stationId: string,
        deviceNoOrName: string,
        modelIds: string,
        areaIds: string,
        page: number
    ): Observable<Object> {
        let url =
            this.equipmentListUrl +
            '?stationId=' +
            stationId +
            '&deviceNoOrName=' +
            deviceNoOrName +
            '&modelIds=' +
            modelIds +
            '&areaIds=' +
            areaIds +
            '&size=10' +
            '&page=' +
            page;
        return this.http.get(url);
    }
    /**
     * 查询设备列表
     */
    public getDevicesListUrl(params): Observable<Object> {
        let url = this.devicesListUrl;
        return this.http.get(url, { params: this.mutilservice.filterEffectParam(params) });
    }

    /**
     * 设备区域查询条件
     */
    public getEquipmentArea(stationId: string): Observable<Object[]> {
        let url = this.equipmentAreaUrl + '?stationId=' + stationId;
        return this.http.get(url);
    }

    /**
     * 设备类型查询条件
     */
    public getEquipmentTypes(stationId: string): Observable<Object[]> {
        let url = this.equipmentTypeUrl + '?stationId=' + stationId;
        return this.http.get(url);
    }
    /**
     * 设备类型查询条件
     */
    public getDeviceClasses(params): Observable<Object[]> {
        return this.http.get(this.deviceClassesUrl, {
            params: this.mutilservice.filterEffectParam(params),
        });
    }

    /**
     * 设备监视信息
     */
    public getEquipmentInfo(deviceId: string): Observable<Object[]> {
        let url = this.equipmentInfoUrl + '?deviceId=' + deviceId;
        return this.http.get(url);
    }

    /**
     * 设备告警
     */
    public getDeviceAlarmCount(deviceId: string): Observable<Object[]> {
        let url = this.deviceAlarmCountUrl + '?deviceId=' + deviceId;
        return this.http.get(url);
    }
}
