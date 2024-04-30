import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class UserService {
    private usersListUrl: string;
    userUrl: any;

    constructor(
        public http: AuthHttpService,
        @Inject(APP_CONFIG) public appConfig: AppConfig
    ) {
        this.usersListUrl = this.appConfig.apiEndpoint + '/api/m/v2/users';
    }

    /**
     * 用户列表
     * @param params
     */
    public getUserList(params): Observable<any> {
        let url = this.usersListUrl + '?';
        for (let item in params) {
            if (params[item] !== null) {
                url = url + item + '=' + params[item] + '&';
            }
        }
        url = url.substr(0, url.length - 1);
        return this.http.get(url);
    }

    /**
     * getUserInfo
     */
    public getUserInfo() {
        let url = `${this.appConfig.apiEndpoint}/api/frame/user`;
        return this.http.get(url);
    }

    /**
     * getUserInfo
     */
    public changePassword(params) {
        let url = `${this.appConfig.apiEndpoint}/api/frame/password`;
        return this.http.put(url, '', {
            params,
            responseType: ResponseContentType.Text
        });
    }
}
