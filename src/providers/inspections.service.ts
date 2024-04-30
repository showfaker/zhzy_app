import { Injectable, Inject } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { APP_CONFIG, AppConfig } from '../models/app-config';
import { MutilService } from './util/Mutil.service';

/*
  Generated class for the InspectionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InspectionsProvider {
  inspectionsUrl: string;
  inspectionsTracksUrl: string;
  inspectionObjUrl: string;
  inspectionsCheckUrl: string;
  inspectionsRemindUrl: string;
  inspectionsTypesUrl: string;
  inspectionObjItemhisUrl: string;

  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private mutilservice: MutilService
  ) {
    this.inspectionsUrl = this.appConfig.apiEndpoint + '/api/m/v2/inspections';
    this.inspectionsTypesUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/inspections/types';
    this.inspectionsRemindUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/inspections/remind';
    this.inspectionsCheckUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/inspections/check';
    this.inspectionsTracksUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/inspections/tracks';
    this.inspectionObjUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/inspections/obj';
    this.inspectionObjItemhisUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/inspections/obj/itemhis';
  }

  public getInspectionsList(params) {
    return this.http.get(this.inspectionsUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public getInspectionsTypes() {
    return this.http.get(this.inspectionsTypesUrl);
  }

  public getInspectionsDetails(inspectionId, params) {
    return this.http.get(this.inspectionsUrl + '/' + inspectionId, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public inspectionsAction(params) {
    return this.http.post(this.inspectionsUrl, params);
  }

  public inspectionsUpdateAction(params) {
    return this.http.put(this.inspectionsUrl, params);
  }
  public deleteInspection(inspectionId) {
    return this.http.delete(this.inspectionsUrl, { params: { inspectionId } });
  }

  public getTracks(inspectionId) {
    return this.http.get(this.inspectionsTracksUrl, {
      params: { inspectionId },
    });
  }

  public saveTracks(inspectionId, params) {
    return this.http.put(this.inspectionsTracksUrl, params, {
      params: { inspectionId },
    });
  }

  public deleteObj(objId) {
    return this.http.delete(this.inspectionObjUrl + '?objId=' + objId);
  }

  public getObj(params) {
    return this.http.get(this.inspectionObjUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public getObjItemHis(params) {
    return this.http.get(this.inspectionObjItemhisUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public saveObj(params) {
    return this.http.post(this.inspectionObjUrl, params);
  }

  public check(params) {
    return this.http.put(this.inspectionsCheckUrl, params, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }
  public remind(inspectionId) {
    return this.http.put(
      this.inspectionsRemindUrl,
      { inspectionId },
      {
        params: { inspectionId },
        responseType: 0,
      }
    );
  }
}
