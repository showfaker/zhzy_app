import { Injectable, Inject } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AppConfig, APP_CONFIG } from "../models/app-config";
import { AuthHttpService } from "./auth-http.service";
import {
  SampleStationsResp,
  SampleStationsRespContent
} from "../models/sample-stations-resp";

@Injectable()
export class EquipmentService {
  private equipmentListUrl: string;
  private recentStationsUrl: string;
  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.equipmentListUrl = this.appConfig.apiEndpoint + "/api/device/devices";
    this.recentStationsUrl =
      this.appConfig.apiEndpoint + "/api/v1/monitor/recentStations";
  }
  /**
   * 设备列表
   */
  public getequipmentListUrl(
    stationId: string,
    page: number,
    deviceNoOrName?: string
  ): Observable<SampleStationsResp> {
    if (!page) {
      page = 0;
    }
    let url =
      this.equipmentListUrl +
      "?stationIds=" +
      stationId +
      "&page=" +
      page +
      "&size=" +
      20;
    if (deviceNoOrName) {
      url = url + "&deviceNoOrName=" + deviceNoOrName;
    }
    return this.http.get(url);
  }

  /**
   * 设备列表
   */
  public getRecentStations(): Observable<SampleStationsRespContent[]> {
    let url = this.recentStationsUrl;
    return this.http.get(url);
  }
}
