import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class OperationsService {
    private ordersTypeUrl:string;
    private ordersDayUrl:string;
    private workbenchOrdersUrl:string;
    private workbenchRemindUrl : string;
    constructor(
        public http: AuthHttpService,
        @Inject(APP_CONFIG) public appConfig: AppConfig
    ) {RTCDTMFToneChangeEvent
       this.ordersTypeUrl = this.appConfig.apiEndpoint + '/api/m/v2/workbench/orders/type'  ;// 工单类型统计接口
       this.ordersDayUrl = this.appConfig.apiEndpoint + '/api/m/v2/workbench/orders/day'  ;// 每日工单统计接口
       this.workbenchOrdersUrl = this.appConfig.apiEndpoint + '/api/m/v2/workbench/orders'  ;// 工单列表
       this.workbenchRemindUrl = this.appConfig.apiEndpoint + '/api/m/v2/workbench/remind'  ;// 催单
       
    }

    /**
     * 工单类型统计接口
     * @param dataType 
     * @param startDate 
     * @param endDate 
     */
    ordersType(dataType,startDate,endDate){
        let url = `${this.ordersTypeUrl}?dataType=${dataType}&startDate=${startDate}&endDate=${endDate}`;
        
        return this.http.get(url)
    }

     /**
     * 每日工单统计接口
     * @param dataType 
     * @param startDate 
     * @param endDate 
     */
    orderDay(dataType,startDate,endDate){
        let url = `${this.ordersDayUrl}?dataType=${dataType}&startDate=${startDate}&endDate=${endDate}`;
        
        return this.http.get(url)
    }

    /**
     * 工单列表
     * @param dataType 
     * @param status 
     * @param startDate 
     * @param endDate 
     */
    workbenchOrders(dataType,status,startDate,endDate,page){
        let url = `${this.workbenchOrdersUrl}?dataType=${dataType}&status=${status}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=10`;
        
        return this.http.get(url)
    }

      /**
     * 催单
     * @param orderId 
     */
    workbenchRemind(orderId){
        let url = `${this.workbenchRemindUrl}`;
        
        return this.http.put(url,{orderId})
    }

}
