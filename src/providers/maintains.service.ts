import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { APP_CONFIG, AppConfig } from '../models/app-config';
import { MutilService } from './util/Mutil.service';

/*
  Generated class for the MaintainsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MaintainsProvider {
  maintainsUrl: string;
  maintainsTypesUrl: string;
  maintainsObjUrl: string;
  maintainsRemindUrl: string;
  maintainsCheckUrl: string;
  maintainsObjItemisUrl: string;
  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private mutilservice: MutilService
  ) {
    console.log('Hello MaintainsProvider Provider');
    this.maintainsUrl = this.appConfig.apiEndpoint + '/api/m/v2/maintains';
    this.maintainsTypesUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/maintains/types';
    this.maintainsObjUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/maintains/obj';
    this.maintainsRemindUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/maintains/remind';
    this.maintainsCheckUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/maintains/check';
    this.maintainsObjUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/maintains/obj';
    this.maintainsObjItemisUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/maintains/obj/itemhis';
  }

  public getMaintainsList(params) {
    return this.http.get(this.maintainsUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }
  public getMaintainsTypes() {
    return this.http.get(this.maintainsTypesUrl);
  }

  public getMaintainsDetails(inspectionId, params) {
    return this.http.get(this.maintainsUrl + '/' + inspectionId, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public maintainsAction(params) {
    return this.http.post(this.maintainsUrl, params);
  }

  public maintainsUpdateAction(params) {
    return this.http.put(this.maintainsUrl, params);
  }
  public deleteMaintains(inspectionId) {
    return this.http.delete(this.maintainsUrl, { params: { inspectionId } });
  }

  public deleteObj(objId) {
    return this.http.delete(this.maintainsObjUrl + '?objId=' + objId);
  }

  public getObj(params) {
    return this.http.get(this.maintainsObjUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public getObjItemHis(params) {
    return this.http.get(this.maintainsObjItemisUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public saveObj(params) {
    return this.http.post(this.maintainsObjUrl, params);
  }

  public check(params) {
    return this.http.put(this.maintainsCheckUrl, params, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public remind(inspectionId) {
    return this.http.put(
      this.maintainsRemindUrl,
      { inspectionId },
      {
        params: { inspectionId },
        responseType: 0,
      }
    );
  }
}
