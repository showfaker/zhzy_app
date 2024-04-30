import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export interface AppConfig {
  title: string;
  logo: string;
  apiEndpoint: string;
  fileEndpoint: string;
  showHomeTab: boolean;
  checkUpdateUrl: string;
  theme?: string;
}

export const DEV_CONFIG: AppConfig = {
  title: '测试地址',
  logo: 'others.png',
  // apiEndpoint: 'http://10.176.130.155:18000',
  // apiEndpoint: 'http://10.176.129.39:18000',
  // fileEndpoint: 'http://10.176.130.155:8088',
  apiEndpoint: 'http://dev.jszyet.com.cn:8444',
  fileEndpoint: 'http://dev.jszyet.com.cn:8802',
  showHomeTab: true,
  checkUpdateUrl: null,
  theme: 'light-theme',
};

export const RELEASE_CONFIG: AppConfig = {
  title: '生产地址',
  logo: 'linyang.png',
  apiEndpoint: 'http://www.jszyet.com.cn:8442',
  fileEndpoint: 'http://www.jszyet.com.cn:8800',
  showHomeTab: true,
  checkUpdateUrl: null,
  theme: 'light-theme',
};
