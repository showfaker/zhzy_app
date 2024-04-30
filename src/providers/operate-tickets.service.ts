import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { APP_CONFIG, AppConfig } from '../models/app-config';
import { MutilService } from './util/Mutil.service';
import { ResponseContentType } from '@angular/http';

/*
  Generated class for the OperateTicketsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OperateTicketsProvider {
  operateTicketsListUrl: string;
  operateTicketsDetailsUrl: string;
  remindUrl: string;
  checkUrl: string;
  operateTemplatesUrl: string;
  operateTemplateUrl: string;
  operateTmpSaveUrl: string;

  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private mutilservice: MutilService
  ) {
    // 查询操作票列表url
    this.operateTicketsListUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/tickets/operate/tickets';

    this.operateTicketsDetailsUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/tickets/operate';
    this.checkUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/tickets/operate/check';
    this.operateTemplatesUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/tickets/operate/templates';
    this.operateTemplateUrl =
      this.appConfig.apiEndpoint + '/api/m/v2/tickets/operate/template';
    this.operateTmpSaveUrl =
      this.appConfig.apiEndpoint + '/api/tickets/operate';
  }

  // 操作票列表
  public getOperateTicketsList(params) {
    return this.http.get(this.operateTicketsListUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  // 查询操作票详情
  public getOperateTicketsDetails(ticketId) {
    return this.http.get(this.operateTicketsDetailsUrl + '/' + ticketId);
  }

  public check(params) {
    return this.http.put(
      this.checkUrl,
      {},
      {
        params: this.mutilservice.filterEffectParam(params),
      }
    );
  }

  // 完成
  public operate(params) {
    return this.http.put(this.operateTicketsDetailsUrl, params);
  }

  public deleteOperateTickets(ticketId) {
    return this.http.delete(
      this.operateTicketsDetailsUrl + '?ticketId=' + ticketId
    );
  }

  public create(params) {
    return this.http.put(this.operateTicketsDetailsUrl, params);
  }
  public tmpSavePost(params) {
    return this.http.post(this.operateTmpSaveUrl, params);
  }
  public tmpSavePut(params) {
    return this.http.put(this.operateTmpSaveUrl, params);
  }

  /**
   * /api/m/v2/tickets/operate/templates
   */
  public getOperateTemplates(params) {
    return this.http.get(this.operateTemplatesUrl, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }
  /**
   * /api/m/v2/tickets/operate/template
   */
  public getOperateTemplate(ticketId) {
    return this.http.get(this.operateTemplateUrl + '/' + ticketId);
  }
}
