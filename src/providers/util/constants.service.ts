import { Injectable, Inject } from '@angular/core';
import { AuthHttpService } from '../auth-http.service';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ActionSheetController } from 'ionic-angular';
import { PluginService } from './plugin.service';

@Injectable()
export class ConstantsService {
  private codeSearchUrl: string;
  private uploadUrl = '';
  private weatherInfoUrl: string;
  private codeMap: {} = {};
  private weatherInfoList: {}[] = [];
  lossTypeUrl: string;
  lossTypeList: any;
  constructor(
    public http: AuthHttpService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public pluginService: PluginService,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.codeSearchUrl =
      this.appConfig.apiEndpoint + '/api/propList/propLists/search';
    this.uploadUrl = this.appConfig.apiEndpoint + '/api/doc/upload';
    this.weatherInfoUrl =
      this.appConfig.apiEndpoint +
      '/api/propList/propLists/search?codeId=weatherInfo';
    this.lossTypeUrl =
      this.appConfig.apiEndpoint +
      '/api/propList/propLists/search?codeId=lossType';
  }

  getWeatherInfoName(weatherValue: string) {
    if (!this.weatherInfoList || this.weatherInfoList.length == 0) {
      this.http.get(this.weatherInfoUrl).subscribe((e) => {
        if (e) {
          if (e && e.length > 0) {
            this.weatherInfoList = e;
            this.getWeatherInfoName(weatherValue);
          }
        }
      });
    } else {
      for (let info of this.weatherInfoList) {
        if (info['propValue'] == weatherValue) {
          return info['propName'];
        }
      }
      return '未找到相应天气!';
    }
  }

  weatherInfo(retrueWeather) {
    this.http.get(this.weatherInfoUrl).subscribe((e) => {
      if (e) {
        this.weatherInfoList = e;
        this.buildWeatherSelectList(e, retrueWeather);
      }
    });
  }

  buildWeatherSelectList(weatherInfoList, retrueWeather: Function) {
    let list = [];
    for (let info of weatherInfoList) {
      let selectObj = {
        text: info.propName,
        handler: () => {
          retrueWeather(info);
        },
      };
      list.push(selectObj);
    }
    list.push({
      text: '取消',
      role: 'cancel',
      handler: () => {
        console.log('取消 clicked');
      },
    });
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'weatherpop',
      buttons: list,
    });
    actionSheet.present();
  }

  //损失类别
  lossType(returnLossType) {
    this.http.get(this.lossTypeUrl).subscribe((e) => {
      if (e) {
        this.lossTypeList = e;
        this.buildLossTypesSelectList(e, returnLossType);
      }
    });
  }

  //损失类别列表
  buildLossTypesSelectList(weatherInfoList, returnLossType: Function) {
    let list = [];
    for (let info of weatherInfoList) {
      let selectObj = {
        text: info.propName,
        handler: () => {
          returnLossType(info);
        },
      };
      list.push(selectObj);
    }
    list.push({
      text: '取消',
      role: 'cancel',
      handler: () => {
        console.log('取消 clicked');
      },
    });
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'weatherpop',
      buttons: list,
    });
    actionSheet.present();
  }

  /**
   * 获取码表数据
   * @param codeId
   */
  getCodeSearch(codeId: string) {
    if (this.codeMap[codeId]) {
      return Observable.create((observer) => {
        observer.next(this.codeMap[codeId]);
        observer.complete();
      });
    } else {
      return this.http.get(this.codeSearchUrl + '?codeId=' + codeId).pipe(
        map((e) => {
          if (e) {
            this.codeMap[codeId] = e;
            return e;
          }
        })
      );
    }
  }

  getCoedeText(codeId: string, codeValue: string) {
    let name = '';
    if (this.codeMap[codeId]) {
      for (let index = 0; index < this.codeMap[codeId].length; index++) {
        const code = this.codeMap[codeId][index];
        if (code.propValue == codeValue) {
          name = code.propName;
          break;
        }
      }
      return Observable.create((observer) => {
        observer.next(name);
        observer.complete();
      });
    } else {
      return this.getCodeSearch(codeId).pipe(
        map((e) => {
          for (let index = 0; index < this.codeMap[codeId].length; index++) {
            const code = this.codeMap[codeId][index];
            if (code.propValue == codeValue) {
              name = code.propName;
              break;
            }
          }
          return name;
        })
      );
    }
  }

  uploadFile(fileUrl: string, fileKey?: string): Promise<string> {
    return this.pluginService.uploadPic(fileUrl, this.uploadUrl, fileKey);
  }
}
