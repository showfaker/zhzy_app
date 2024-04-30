import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class QrSearchService {
    private qrsearchUrl: string;
    deviceInfoUrl: string;
    deviceTopoUrl: string;
    deviceDocsUrl: string;
    constructor(
        public http: AuthHttpService,
        @Inject(APP_CONFIG) public appConfig: AppConfig
    ) {
        this.qrsearchUrl =
            this.appConfig.apiEndpoint + '/api/m/v2/framework/qrsearch';
        this.deviceInfoUrl =
            this.appConfig.apiEndpoint + '/api/m/v2/device/deviceInfo';
        this.deviceTopoUrl = this.appConfig.apiEndpoint + '/api/device/topo';
        this.deviceDocsUrl = this.appConfig.apiEndpoint + '/api/device/docs';
    }

    qrsearch(device) {
        let url = this.qrsearchUrl + '?code=' + device;
        return this.http.get(url);
    }

    getDeviceInfo(deviceId) {
        let url = this.deviceInfoUrl + '?deviceId=' + deviceId;
        return this.http.get(url);
    }
    getDeviceTopo(deviceId) {
        let url = this.deviceTopoUrl + '?deviceId=' + deviceId;
        return this.http.get(url);
    }
    getDeviceDocs(deviceId) {
        let url = this.deviceDocsUrl + '?deviceId=' + deviceId;
        return this.http.get(url);
    }
}
