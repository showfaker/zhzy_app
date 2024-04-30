import { MutilService } from './util/Mutil.service';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';
import { Defect } from '../models/defect';
import { DefectCondition } from '../models/defect.condition';
import { DefectAdd } from '../models/defect.add';
import { map } from 'rxjs/operators';

@Injectable()
export class DefesService {
  private defects: string;
  private noticeUserUrl: string;
  private userInfoUrl: string;
  private user;
  newDefects: string;
  remindUrl: string;
  defectDetailUrl: string;
  defectNullableUrl: string;
  checkUrl: string;
  defectsActionUrl: string;
  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private mutilservice: MutilService
  ) {
    this.defects = this.appConfig.apiEndpoint + '/api/defects';
    this.noticeUserUrl =
      this.appConfig.apiEndpoint + '/api/AlarmNoticeRule/getNoticeUser';
    this.userInfoUrl = this.appConfig.apiEndpoint + '/api/user-info';

    this.newDefects = this.appConfig.apiEndpoint + '/api/m/v2/defect/defects';
    this.remindUrl = this.appConfig.apiEndpoint + '/api/m/v2/defect/remind';
    this.checkUrl = this.appConfig.apiEndpoint + '/api/m/v2/defect/check';
    this.defectDetailUrl = this.appConfig.apiEndpoint + '/api/m/v2/defect';
    this.defectNullableUrl =
      this.appConfig.apiEndpoint + '/api/workflows/nullable';
    this.defectsActionUrl = this.appConfig.apiEndpoint + '/api/m/v2/defect';
  }

  /**
   * 筛选查询 缺陷列表
   * @param defectCondition
   */
  public getDefects(defectCondition: DefectCondition): Observable<Defect[]> {
    let url = this.defects + '?';
    for (let defct in defectCondition) {
      if (defectCondition[defct]) {
        url = url + defct + '=' + defectCondition[defct] + '&';
      }
    }
    url = url.substr(0, url.length - 1);
    return this.http.get(url);
  }

  /**
   * 查询单个 缺陷
   * @param defectCondition
   */
  public getDefectsById(defectId: string): Observable<Defect> {
    let url = this.defects + '/' + defectId;
    return this.http.get(url);
  }

  /**
   * 添加新 缺陷
   * @param defectCondition
   */
  public addDefects(defectAdd: DefectAdd): Observable<Defect> {
    return this.http.post(this.defects, defectAdd);
  }

  /**
   * 修改缺陷
   */
  public updateDefects(defect: Defect) {
    return this.http.put(this.defects, defect);
  }

  public getUserInfo() {
    if (this.user) {
      return Observable.create((observer) => {
        observer.next(this.user);
        observer.complete();
      });
    } else {
      return this.http.get(this.userInfoUrl).pipe(
        map((e) => {
          if (e) {
            this.user = e;
            return e;
          }
        })
      );
    }
  }

  /**
   * "deptId": "string",
   * "enabled": "string",
   * "realName": "string"
   * @param user
   */
  public getNoticeUser(user) {
    return this.http.post(this.noticeUserUrl, user);
  }

  public getDefectsList(params) {
    let url = this.newDefects + '?';
    for (let defct in params) {
      if (params[defct]) {
        url = url + defct + '=' + params[defct] + '&';
      }
    }
    url = url.substr(0, url.length - 1);
    return this.http.get(url);
  }

  public remind(defectId) {
    return this.http.put(
      this.remindUrl + '?defectId=' + defectId,
      {
        defectId,
      },
      { responseType: ResponseContentType.Text }
    );
  }
  public check(params) {
    let url = this.checkUrl + '?';
    for (let defct in params) {
      if (params[defct]) {
        url = url + defct + '=' + params[defct] + '&';
      }
    }
    url = url.substr(0, url.length - 1);
    return this.http.put(url, { params });
  }

  public getDefectDetail(defectId, params) {
    return this.http.get(this.defectDetailUrl + '/' + defectId, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public checkNullable(targetNodeId) {
    return this.http.get(
      this.defectNullableUrl + '?targetNodeId=' + targetNodeId
    );
  }

  public defectAction(params) {
    return this.http.put(this.defectDetailUrl, params);
  }

  public defectActionDelete(defectId) {
    return this.http.delete(this.defectDetailUrl + '?defectId=' + defectId);
  }
}
