import { MutilService } from './util/Mutil.service';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import { AuthHttpService } from './auth-http.service';
import { SampleStationsResp } from '../models/sample-stations-resp';
import { MeterialCondition } from '../models/material.condition';
import { Meterial } from '../models/meterial';
import { Warehouse } from '../models/warehouse';
import { Classfication } from '../models/classfication';

@Injectable()
export class MaterialService {
  private materialInventorysUrl: string;
  private warehousesByCustomerIdUrl: string;
  private classficationsUrl: string;
  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private mutilservice: MutilService
  ) {
    this.materialInventorysUrl =
      this.appConfig.apiEndpoint + '/api/material/materialInventorys';
    this.warehousesByCustomerIdUrl =
      this.appConfig.apiEndpoint + '/api/warehouse/warehousesByCustomerId';
    this.classficationsUrl =
      this.appConfig.apiEndpoint + '/api/materialInfo/classfications';
  }
  /**
   * 筛选查询  备件（工具）列表
   * @param defectCondition
   */
  public getMeterial(
    meterialCondition: MeterialCondition
  ): Observable<Meterial[]> {
    let url = this.materialInventorysUrl + '?';
    for (let defmeterialct in meterialCondition) {
      if (meterialCondition[defmeterialct]) {
        url =
          url + defmeterialct + '=' + meterialCondition[defmeterialct] + '&';
      }
    }
    url = url.substr(0, url.length - 1);
    return this.http.get(url);
  }

  /**
   * 筛选查询  仓库查询
   * @param defectCondition
   */
  public getWarehouse(): Observable<Warehouse[]> {
    let url = this.warehousesByCustomerIdUrl;
    return this.http.get(url);
  }

  /**
   * 筛选查询  备件(工具)类别筛选内容查询
   * @param defectCondition
   */
  public getclassfications(classType: string): Observable<Classfication[]> {
    let url = this.classficationsUrl + '?classType=' + classType;
    return this.http.get(url);
  }

  //查询仓库列表
  public getWarehouseList(params) {
    let url = `${this.appConfig.apiEndpoint}/api/m/v2/materials/warehouses`;
    return this.http.get(url, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  /**
   * 查询物料列表
   */
  public getMaterialList(params) {
    let url = `${this.appConfig.apiEndpoint}/api/m/v2/materials/materials`;
    return this.http.get(url, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  /**
   * 查询物料列表
   */
  public getMaterialByMaterialNo(materialNo) {
    let url = `${this.appConfig.apiEndpoint}/api/m/v2/materials/material${
      materialNo ? '?materialNo=' + materialNo : ''
    }`;
    return this.http.get(url);
  }

  /**
   * 查询物料列表
   */
  public getMaterialTypes() {
    let url = `${this.appConfig.apiEndpoint}/api/m/v2/materials/materialTypes`;
    return this.http.get(url);
  }

  /**
   * 查询物料列表
   */
  public getInventorisList(params) {
    let url = `${this.appConfig.apiEndpoint}/api/m/v2/materials/inventoris`;
    return this.http.get(url, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  public getInventorisRecordList(params) {
    let url = `${this.appConfig.apiEndpoint}/api/m/v2/materials/iostorages`;
    return this.http.get(url, {
      params: this.mutilservice.filterEffectParam(params),
    });
  }

  /**
   * /api/m/v2/materials/out
   */
  public saveMaterialsOut(params) {
    return this.http.post(
      `${this.appConfig.apiEndpoint}/api/m/v2/materials/out`,
      params
    );
  }
  /**
   * /api/m/v2/materials/in
   */
  public saveMaterialsIn(params) {
    return this.http.post(
      `${this.appConfig.apiEndpoint}/api/m/v2/materials/in`,
      params
    );
  }

  public getOrderIdByOrderCode(orderCode) {
    return this.http.get(
      `${this.appConfig.apiEndpoint}/api/workOrders/orderId?orderCode=${orderCode}`
    );
  }

  public getMaterialsIostorage(iostorageId) {
    return this.http.get(
      `${this.appConfig.apiEndpoint}/api/m/v2/materials/iostorage?iostorageId=${iostorageId}`
    );
  }
  public getmaterialsIoTypes(params) {
    return this.http.get(
      `${this.appConfig.apiEndpoint}/api/m/v2/materials/ioTypes`,
      {
        params,
      }
    );
  }
  public getmaterialsIoSubTypes(ioType, materialType) {
    return this.http.get(
      `${this.appConfig.apiEndpoint}/api/m/v2/materials/ioSubTypes`,
      {
        params: {
          ioType,
          materialType,
        },
      }
    );
  }

  public materialsApprove(params) {
    return this.http.post(
      `${this.appConfig.apiEndpoint}/api/m/v2/materials/approve`,
      {},
      {
        params: this.mutilservice.filterEffectParam(params),
      }
    );
  }
}
