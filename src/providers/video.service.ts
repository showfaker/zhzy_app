import { Injectable, Inject } from '@angular/core';
import { ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';
import { SampleStationsResp } from '../models/sample-stations-resp';
import { Video } from '../models/video';

export class VideoUser {
  ip: string;
  port: string;
  user: string;
  pass: string;
}

@Injectable()
export class VideoService {
  public videoListUrl: string;
  public camerasLiveAddress: string;
  constructor(public http: AuthHttpService, @Inject(APP_CONFIG) public appConfig: AppConfig) {
    // this.videoListUrl =
    //     this.appConfig.apiEndpoint + '/api/cameraController/AvailableCameraDtos';
    // this.videoUserUrl = this.appConfig.apiEndpoint + '/api/cameraController/userInfo';
    // this.hikHlsUrl = this.appConfig.apiEndpoint + '/api/cameraController/hik/hls/real';

    this.videoListUrl = this.appConfig.apiEndpoint + '/api/cameras';
    this.camerasLiveAddress = this.appConfig.apiEndpoint + '/api/cameras/live/address'
  }
  // /**
  //  * 视频列表
  //  */
  // public videoList(stationId: string): Observable<object> {
  //     let url = this.videoListUrl + '?stationId=' + stationId;
  //     return this.http.get(url);
  // }
  // public videoUser(): Observable<VideoUser> {
  //     return this.http.get(this.videoUserUrl);
  // }
  // public getHikHls(cameraId) {
  //     return this.http.get(this.hikHlsUrl + '?cameraId=' + cameraId, {
  //         responseType: ResponseContentType.Text
  //     });
  // }


  public getCameras(params) {
    return this.http.get(this.videoListUrl, {
      params
    })
  }

  public getCamerasLiveAddress(params) {
    return this.http.get(this.camerasLiveAddress, { params })
  }

}
