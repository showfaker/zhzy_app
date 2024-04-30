import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { AppConfig, APP_CONFIG } from '../../models/app-config';

@Injectable()
export class SettingsProvider {
  theme: BehaviorSubject<string>;
  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {
    this.theme = new BehaviorSubject(appConfig.theme);
    (document.body as any).classList = appConfig.theme;
  }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }
}
