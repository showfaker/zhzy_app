import { MutilService } from './util/Mutil.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { APP_CONFIG, AppConfig } from '../models/app-config';
import { ResponseContentType } from '@angular/http';

/*
  Generated class for the RepairTicketsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RepairTicketsProvider {
    repairTicketsListUrl: string;
    remindUrl: string;
    checkUrl: string;
    repairTicketsDetailsUrl: string;
    teamListUrl: string;

    constructor(
        public http: AuthHttpService,
        @Inject(APP_CONFIG) public appConfig: AppConfig,
        private mutilservice: MutilService
    ) {
        this.repairTicketsListUrl = this.appConfig.apiEndpoint + '/api/m/v2/repairTickets/tickets';
        this.repairTicketsDetailsUrl = this.appConfig.apiEndpoint + '/api/m/v2/repairTickets';
        this.remindUrl = this.appConfig.apiEndpoint + '/api/m/v2/repairTickets/remind';
        this.checkUrl = this.appConfig.apiEndpoint + '/api/m/v2/repairTickets/check';
        this.teamListUrl = this.appConfig.apiEndpoint + '/api/teams';
    }

    // 查询缺陷单列表
    public getRepairTicketsList(params) {
        return this.http.get(this.repairTicketsListUrl, {
            params: this.mutilservice.filterEffectParam(params)
        });
    }

    // 查询缺陷单详情
    public getRepairTicketsDetails(ticketId, params) {
        return this.http.get(this.repairTicketsDetailsUrl + '/' + ticketId, {
            params: this.mutilservice.filterEffectParam(params)
        });
    }

    public remind(ticketId) {
        return this.http.put(
            this.remindUrl + '?ticketId=' + ticketId,
            {
                ticketId
            },
            { responseType: ResponseContentType.Text }
        );
    }

    public check(params) {
        return this.http.put(
            this.checkUrl,
            {},
            {
                params: this.mutilservice.filterEffectParam(params)
            }
        );
    }

    public create(params) {
        return this.http.put(this.repairTicketsDetailsUrl, params);
    }

    public detelterepairTickets(ticketId) {
        return this.http.delete(this.repairTicketsDetailsUrl + '?ticketId=' + ticketId);
    }

    getTeamList(params) {
        return this.http.get(this.teamListUrl, {
            params: this.mutilservice.filterEffectParam(params)
        });
    }
}
