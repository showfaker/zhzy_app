import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { _throw } from 'rxjs/observable/throw';
import { catchError, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { MutilService } from './../../util/Mutil.service';

@Injectable()
export class ResponseHandlerInterceptor implements HttpInterceptor {
  constructor(public events: Events, private mutil: MutilService) {}
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      filter((event) => event instanceof HttpResponse && event.status === 200),
      map((event: HttpResponse<any>) => {
        this.mutil.hideLoading();
        if (event.body.status === -1) {
          throw new HttpErrorResponse({
            headers: event.headers,
            url: event.url,
            error: event.body.data,
            status: 500,
            statusText: 'error',
          });
        }

        return event.clone({ body: event.body.data });
      }),
      catchError((res) => {
        switch (res.error.code) {
          case 300:
            this.events.publish('login:out');
            break;
          default:
            if (
              res.error.error === 'com.cie.nems.common.exception.NemsException'
            ) {
              this.mutil.popToastView(res.error.message);
              this.mutil.hideLoading();
            } else {
              this.mutil.popToastView('系统错误，请联系管理员！');
            }
        }
        return _throw(res);
      })
    );
  }
}
