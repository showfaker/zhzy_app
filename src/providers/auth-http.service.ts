import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import { AppConfig, APP_CONFIG } from '../models/app-config';
import jsrsasign from 'jsrsasign';
import { Observer } from 'rxjs';

export interface ResultResponse<T> {
  status?: number; // 代码
  data?: T; // 数据
}

@Injectable()
export class AuthHttpService {
  private token: string;
  private authUrl: string = 'http://114.55.132.103:8000/api/auth';
  customersUrl: string;
  registerUrl: string;

  constructor(
    public http: HttpClient,
    public events: Events,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.token = localStorage.getItem('_TOKEN_');
    this.authUrl = this.appConfig.apiEndpoint + '/api/m/v2/framework/auth';
    this.customersUrl =
      this.appConfig.apiEndpoint + '/api/customerInfo/customers';
    this.registerUrl = this.appConfig.apiEndpoint + '/api/register';
  }

  /**
   * 通用get方法
   * @param url
   */
  public get(url: string, options?: any): Observable<any> {
    return this.http.get(url, { ...options });
  }

  public post(url: string, obj: any, options = {}): Observable<any> {
    return this.http.post<any>(url, obj, { ...options });
  }

  public put(url: string, obj: any, options: any = {}): Observable<any> {
    return this.http.put<any>(url, obj, { ...options });
  }

  public delete(url: string, options = {}): Observable<any> {
    return this.http.delete<any>(url, { ...options });
  }
  /**
   * 鉴权接口
   * @param username
   * @param password
   */
  async auth(username: string, password: string): Promise<any> {
    const cipherpwd = await this.getLoginPassword(password);
    return this.http
      .post(this.authUrl, { username: username, password: null, cipherpwd })
      .pipe(
        map((response: any) => {
          let resObj = response;
          this.token = resObj.token;
          localStorage.setItem('_TOKEN_', this.token);
          return resObj;
        }),
        catchError((error) => {
          return Observable.throw(error);
        })
      )
      .toPromise();
  }

  async getLoginPassword(password) {
    // RSA
    // 创建一个对象
    let rsa = new jsrsasign.RSAKey();
    // 使用公钥加密
    const secretkey = await this.getPublicKey();

    const publicKey =
      '-----BEGIN PUBLIC KEY-----\n' + secretkey + '\n-----END PUBLIC KEY-----';
    console.log(publicKey);
    rsa = jsrsasign.KEYUTIL.getKey(publicKey);

    console.log(rsa);

    const enc = jsrsasign.KJUR.crypto.Cipher.encrypt(password, rsa);
    // 转换成Base64格式
    const base64Sign = jsrsasign.hextob64(enc);

    return base64Sign;
  }

  async getPublicKey() {
    return this.get(
      `${this.appConfig.apiEndpoint}/api/auth/publicKey`
    ).toPromise();
  }

  public queryCustomers(name) {
    return this.get(this.customersUrl, { params: { name } });
  }
  public register(params, options) {
    return this.post(this.registerUrl, params, { ...options });
  }

  /**
   * 验证token是否有效
   */
  public tokenValidate(): Observable<boolean> {
    return Observable.create((observer) => {
      observer.next(this.token != null);
      observer.complete();
    });
  }
}
