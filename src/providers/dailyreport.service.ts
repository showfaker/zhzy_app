import { Injectable, Inject } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AppConfig, APP_CONFIG } from "../models/app-config";
import { AuthHttpService } from "./auth-http.service";

@Injectable()
export class DailyReportService {
    private repotListUrl: string;
    private repotDetailUrl: string;
    private groupProUrl: string;
    private partProUrl: string;
    constructor(
        public http:AuthHttpService,
        @Inject(APP_CONFIG) public appConfig:AppConfig
    ){
        this.repotListUrl = this.appConfig.apiEndpoint + "/api/v1/groupreports/list";
        this.repotDetailUrl = this.appConfig.apiEndpoint + "/api/v1/groupreports/basic";
        this.groupProUrl = this.appConfig.apiEndpoint + "/api/v1/groupreports/groupData";
        this.partProUrl = this.appConfig.apiEndpoint + "/api/v1/groupreports/regionData";
    }
    /**
     * 日报列表
     */
    public getReportList(page?:number,size?:number) {
        let url = this.repotListUrl + "?page="+ page;
        return this.http.get(url);
    }

    /**
     * 日报详情
     */

     public getReportDetail(date?:string){
        let url = this.repotDetailUrl + "?date=" + date;
        return this.http.get(url);
     }

     /**
      * 集团生产进度
      */
      public getGroupProgress(date?:string){
          let url = this.groupProUrl + "?date=" + date;
          return this.http.get(url);
      }

      /**
       * 分区月度生产进度
       */

       public getPartProgress(date?:string){
           let url = this.partProUrl + "?date=" + date;
           return this.http.get(url);
       }
}