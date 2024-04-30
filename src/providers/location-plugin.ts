import { Injectable } from '@angular/core';
declare const LocationPlugin;

@Injectable()
export class NativeService {
    constructor() {}
    /**
     * 获得用户当前坐标/坐标系为火星坐标系（GCJ-02）坐标系
     * @return {Promise<any>}
     */
    getUserLocation(): Promise<any> {
        return new Promise((resolve) => {
            LocationPlugin.getLocation(
                (data) => {
                    resolve({ lng: data.longitude, lat: data.latitude });
                },
                (msg) => {
                    alert(
                        msg.indexOf('缺少定位权限') == -1
                            ? '错误消息：' + msg
                            : '缺少定位权限，请在手机设置中开启'
                    );
                }
            );
        });
    }
}
