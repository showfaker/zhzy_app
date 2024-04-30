import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MutilService } from './../../util/Mutil.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private mutilservice: MutilService, private events: Events) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const errorInfo =
          typeof err.error === 'object' ? err.error : JSON.parse(err.error);
        const error = errorInfo.message || err.statusText;
        if (
          err.status === 401 &&
          request.url.indexOf('/api/m/v2/framework/auth') !== -1
        ) {
          return Observable.throw('用户名或者密码错误');
        } else if (
          errorInfo.exception === 'com.cie.nems.common.exception.NemsException'
        ) {
          return Observable.throw(errorInfo.message);
        } else if (
          errorInfo.exception ===
          'com.cie.nems.common.exception.SessionTimeoutException'
        ) {
          this.events.publish('login:out');
          return Observable.throw(error);
        }
        return Observable.throw('系统错误，请联系管理员！');
      })
    );
  }
}
