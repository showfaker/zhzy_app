import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('_TOKEN_');
    if (authToken) {
      request = request.clone({
        setHeaders: {
          ['Authorization']: `Bearer ${authToken}`,
        },
      });
    }
    return next.handle(request);
  }
}
